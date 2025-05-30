/* eslint-disable default-case */
/* eslint-disable no-throw-literal */
/* eslint-disable no-redeclare */
/* eslint-disable eqeqeq */
/* eslint-disable no-array-constructor */
//
// Ported to JavaScript by Lazar Laszlo 2011
//
// lazarsoft@gmail.com, www.lazarsoft.info
//
//

//
// Copyright 2007 ZXing authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {qrcode} from './qrcode'

const MIN_SKIP = 3
const MAX_MODULES = 57
const INTEGER_MATH_SHIFT = 8
const CENTER_QUORUM = 2

const qrcode_ = {}
qrcode_.orderBestPatterns = function (patterns) {
  function distance(pattern1, pattern2) {
    const xDiff = pattern1.X - pattern2.X
    const yDiff = pattern1.Y - pattern2.Y
    return Math.sqrt((xDiff * xDiff + yDiff * yDiff))
  }

  /// <summary> Returns the z component of the cross product between vectors BC and BA.</summary>
  function crossProductZ(pointA, pointB, pointC) {
    const bX = pointB.x
    const bY = pointB.y
    return ((pointC.x - bX) * (pointA.y - bY)) - ((pointC.y - bY) * (pointA.x - bX))
  }

  // Find distances between pattern centers
  const zeroOneDistance = distance(patterns[0], patterns[1])
  const oneTwoDistance = distance(patterns[1], patterns[2])
  const zeroTwoDistance = distance(patterns[0], patterns[2])

  let pointA; let pointB; let
    pointC
  // Assume one closest to other two is B; A and C will just be guesses at first
  if (oneTwoDistance >= zeroOneDistance && oneTwoDistance >= zeroTwoDistance) {
    pointB = patterns[0]
    pointA = patterns[1]
    pointC = patterns[2]
  } else if (zeroTwoDistance >= oneTwoDistance && zeroTwoDistance >= zeroOneDistance) {
    pointB = patterns[1]
    pointA = patterns[0]
    pointC = patterns[2]
  } else {
    pointB = patterns[2]
    pointA = patterns[0]
    pointC = patterns[1]
  }

  // Use cross product to figure out whether A and C are correct or flipped.
  // This asks whether BC x BA has a positive z component, which is the arrangement
  // we want for A, B, C. If it's negative, then we've got it flipped around and
  // should swap A and C.
  if (crossProductZ(pointA, pointB, pointC) < 0.0) {
    const temp = pointA
    pointA = pointC
    pointC = temp
  }

  patterns[0] = pointA
  patterns[1] = pointB
  patterns[2] = pointC
}

function FinderPattern(posX, posY, estimatedModuleSize) {
  this.x = posX
  this.y = posY
  this.count = 1
  this.estimatedModuleSize = estimatedModuleSize

  this.__defineGetter__('EstimatedModuleSize', function () {
    return this.estimatedModuleSize
  })
  this.__defineGetter__('Count', function () {
    return this.count
  })
  this.__defineGetter__('X', function () {
    return this.x
  })
  this.__defineGetter__('Y', function () {
    return this.y
  })
  this.incrementCount = function () {
    this.count++
  }
  this.aboutEquals = function (moduleSize, i, j) {
    if (Math.abs(i - this.y) <= moduleSize && Math.abs(j - this.x) <= moduleSize) {
      const moduleSizeDiff = Math.abs(moduleSize - this.estimatedModuleSize)
      return moduleSizeDiff <= 1.0 || moduleSizeDiff / this.estimatedModuleSize <= 1.0
    }
    return false
  }
}

function FinderPatternInfo(patternCenters) {
  this.bottomLeft = patternCenters[0]
  this.topLeft = patternCenters[1]
  this.topRight = patternCenters[2]
  this.__defineGetter__('BottomLeft', function () {
    return this.bottomLeft
  })
  this.__defineGetter__('TopLeft', function () {
    return this.topLeft
  })
  this.__defineGetter__('TopRight', function () {
    return this.topRight
  })
}

function FinderPatternFinder() {
  this.image = null
  this.possibleCenters = []
  this.hasSkipped = false
  this.crossCheckStateCount = new Array(0, 0, 0, 0, 0)
  this.resultPointCallback = null

  this.__defineGetter__('CrossCheckStateCount', function () {
    this.crossCheckStateCount[0] = 0
    this.crossCheckStateCount[1] = 0
    this.crossCheckStateCount[2] = 0
    this.crossCheckStateCount[3] = 0
    this.crossCheckStateCount[4] = 0
    return this.crossCheckStateCount
  })

  this.foundPatternCross = function (stateCount) {
    let totalModuleSize = 0
    for (let i = 0; i < 5; i++) {
      const count = stateCount[i]
      if (count == 0) {
        return false
      }
      totalModuleSize += count
    }
    if (totalModuleSize < 7) {
      return false
    }
    const moduleSize = Math.floor((totalModuleSize << INTEGER_MATH_SHIFT) / 7)
    const maxVariance = Math.floor(moduleSize / 2)
    // Allow less than 50% variance from 1-1-3-1-1 proportions
    return Math.abs(moduleSize - (stateCount[0] << INTEGER_MATH_SHIFT)) < maxVariance && Math.abs(moduleSize - (stateCount[1] << INTEGER_MATH_SHIFT)) < maxVariance && Math.abs(3 * moduleSize - (stateCount[2] << INTEGER_MATH_SHIFT)) < 3 * maxVariance && Math.abs(moduleSize - (stateCount[3] << INTEGER_MATH_SHIFT)) < maxVariance && Math.abs(moduleSize - (stateCount[4] << INTEGER_MATH_SHIFT)) < maxVariance
  }
  this.centerFromEnd = function (stateCount, end) {
    return (end - stateCount[4] - stateCount[3]) - stateCount[2] / 2.0
  }
  this.crossCheckVertical = function (startI, centerJ, maxCount, originalStateCountTotal) {
    const {image} = this

    const maxI = qrcode.height
    const stateCount = this.CrossCheckStateCount

    // Start counting up from center
    let i = startI
    while (i >= 0 && image[centerJ + i * qrcode.width]) {
      stateCount[2]++
      i--
    }
    if (i < 0) {
      return NaN
    }
    while (i >= 0 && !image[centerJ + i * qrcode.width] && stateCount[1] <= maxCount) {
      stateCount[1]++
      i--
    }
    // If already too many modules in this state or ran off the edge:
    if (i < 0 || stateCount[1] > maxCount) {
      return NaN
    }
    while (i >= 0 && image[centerJ + i * qrcode.width] && stateCount[0] <= maxCount) {
      stateCount[0]++
      i--
    }
    if (stateCount[0] > maxCount) {
      return NaN
    }

    // Now also count down from center
    i = startI + 1
    while (i < maxI && image[centerJ + i * qrcode.width]) {
      stateCount[2]++
      i++
    }
    if (i == maxI) {
      return NaN
    }
    while (i < maxI && !image[centerJ + i * qrcode.width] && stateCount[3] < maxCount) {
      stateCount[3]++
      i++
    }
    if (i == maxI || stateCount[3] >= maxCount) {
      return NaN
    }
    while (i < maxI && image[centerJ + i * qrcode.width] && stateCount[4] < maxCount) {
      stateCount[4]++
      i++
    }
    if (stateCount[4] >= maxCount) {
      return NaN
    }

    // If we found a finder-pattern-like section, but its size is more than 40% different than
    // the original, assume it's a false positive
    const stateCountTotal = stateCount[0] + stateCount[1] + stateCount[2] + stateCount[3] + stateCount[4]
    if (5 * Math.abs(stateCountTotal - originalStateCountTotal) >= 2 * originalStateCountTotal) {
      return NaN
    }

    return this.foundPatternCross(stateCount) ? this.centerFromEnd(stateCount, i) : NaN
  }
  this.crossCheckHorizontal = function (startJ, centerI, maxCount, originalStateCountTotal) {
    const {image} = this

    const maxJ = qrcode.width
    const stateCount = this.CrossCheckStateCount

    let j = startJ
    while (j >= 0 && image[j + centerI * qrcode.width]) {
      stateCount[2]++
      j--
    }
    if (j < 0) {
      return NaN
    }
    while (j >= 0 && !image[j + centerI * qrcode.width] && stateCount[1] <= maxCount) {
      stateCount[1]++
      j--
    }
    if (j < 0 || stateCount[1] > maxCount) {
      return NaN
    }
    while (j >= 0 && image[j + centerI * qrcode.width] && stateCount[0] <= maxCount) {
      stateCount[0]++
      j--
    }
    if (stateCount[0] > maxCount) {
      return NaN
    }

    j = startJ + 1
    while (j < maxJ && image[j + centerI * qrcode.width]) {
      stateCount[2]++
      j++
    }
    if (j == maxJ) {
      return NaN
    }
    while (j < maxJ && !image[j + centerI * qrcode.width] && stateCount[3] < maxCount) {
      stateCount[3]++
      j++
    }
    if (j == maxJ || stateCount[3] >= maxCount) {
      return NaN
    }
    while (j < maxJ && image[j + centerI * qrcode.width] && stateCount[4] < maxCount) {
      stateCount[4]++
      j++
    }
    if (stateCount[4] >= maxCount) {
      return NaN
    }

    // If we found a finder-pattern-like section, but its size is significantly different than
    // the original, assume it's a false positive
    const stateCountTotal = stateCount[0] + stateCount[1] + stateCount[2] + stateCount[3] + stateCount[4]
    if (5 * Math.abs(stateCountTotal - originalStateCountTotal) >= originalStateCountTotal) {
      return NaN
    }

    return this.foundPatternCross(stateCount) ? this.centerFromEnd(stateCount, j) : NaN
  }
  this.handlePossibleCenter = function (stateCount, i, j) {
    const stateCountTotal = stateCount[0] + stateCount[1] + stateCount[2] + stateCount[3] + stateCount[4]
    let centerJ = this.centerFromEnd(stateCount, j)  // float
    const centerI = this.crossCheckVertical(i, Math.floor(centerJ), stateCount[2], stateCountTotal)  // float
    if (!isNaN(centerI)) {
      // Re-cross check
      centerJ = this.crossCheckHorizontal(Math.floor(centerJ), Math.floor(centerI), stateCount[2], stateCountTotal)
      if (!isNaN(centerJ)) {
        const estimatedModuleSize = stateCountTotal / 7.0
        let found = false
        const max = this.possibleCenters.length
        for (let index = 0; index < max; index++) {
          const center = this.possibleCenters[index]
          // Look for about the same center and module size:
          if (center.aboutEquals(estimatedModuleSize, centerI, centerJ)) {
            center.incrementCount()
            found = true
            break
          }
        }
        if (!found) {
          const point = new FinderPattern(centerJ, centerI, estimatedModuleSize)
          this.possibleCenters.push(point)
          if (this.resultPointCallback != null) {
            this.resultPointCallback.foundPossibleResultPoint(point)
          }
        }
        return true
      }
    }
    return false
  }

  this.selectBestPatterns = function () {
    const startSize = this.possibleCenters.length
    if (startSize < 3) {
      // Couldn't find enough finder patterns
      throw `Couldn't find enough finder patterns (found ${startSize})`
    }

    // Filter outlier possibilities whose module size is too different
    if (startSize > 3) {
      // But we can only afford to do so if we have at least 4 possibilities to choose from
      let totalModuleSize = 0.0
      let square = 0.0
      for (var i = 0; i < startSize; i++) {
        // totalModuleSize +=  this.possibleCenters[i].EstimatedModuleSize;
        const	centerValue = this.possibleCenters[i].EstimatedModuleSize
        totalModuleSize += centerValue
        square += (centerValue * centerValue)
      }
      const average = totalModuleSize / startSize
      this.possibleCenters.sort((center1, center2) => {
				      const dA = Math.abs(center2.EstimatedModuleSize - average)
				      const dB = Math.abs(center1.EstimatedModuleSize - average)
				      if (dA < dB) {
				    	  return (-1)
				      } else if (dA == dB) {
				    	  return 0
				      } else {
				    	  return 1
				      }
      })

      const stdDev = Math.sqrt(square / startSize - average * average)
      const limit = Math.max(0.2 * average, stdDev)
      // for (var i = 0; i < this.possibleCenters.length && this.possibleCenters.length > 3; i++)
      for (var i = this.possibleCenters.length - 1; i >= 0; i--) {
        const pattern = this.possibleCenters[i]
        // if (Math.abs(pattern.EstimatedModuleSize - average) > 0.2 * average)
        if (Math.abs(pattern.EstimatedModuleSize - average) > limit) {
          // this.possibleCenters.remove(i);
          this.possibleCenters.splice(i, 1)
          // i--;
        }
      }
    }

    if (this.possibleCenters.length > 3) {
      // Throw away all but those first size candidate points we found.
      this.possibleCenters.sort((a, b) => {
        if (a.count > b.count) {
          return -1
        }
        if (a.count < b.count) {
          return 1
        }
        return 0
      })
    }

    return new Array(this.possibleCenters[0], this.possibleCenters[1], this.possibleCenters[2])
  }

  this.findRowSkip = function () {
    const max = this.possibleCenters.length
    if (max <= 1) {
      return 0
    }
    let firstConfirmedCenter = null
    for (let i = 0; i < max; i++) {
      const center = this.possibleCenters[i]
      if (center.Count >= CENTER_QUORUM) {
        if (firstConfirmedCenter == null) {
          firstConfirmedCenter = center
        } else {
          // We have two confirmed centers
          // How far down can we skip before resuming looking for the next
          // pattern? In the worst case, only the difference between the
          // difference in the x / y coordinates of the two centers.
          // This is the case where you find top left last.
          this.hasSkipped = true
          return Math.floor((Math.abs(firstConfirmedCenter.X - center.X) - Math.abs(firstConfirmedCenter.Y - center.Y)) / 2)
        }
      }
    }
    return 0
  }

  this.haveMultiplyConfirmedCenters = function () {
    let confirmedCount = 0
    let totalModuleSize = 0.0
    const max = this.possibleCenters.length
    for (var i = 0; i < max; i++) {
      var pattern = this.possibleCenters[i]
      if (pattern.Count >= CENTER_QUORUM) {
        confirmedCount++
        totalModuleSize += pattern.EstimatedModuleSize
      }
    }
    if (confirmedCount < 3) {
      return false
    }
    // OK, we have at least 3 confirmed centers, but, it's possible that one is a "false positive"
    // and that we need to keep looking. We detect this by asking if the estimated module sizes
    // vary too much. We arbitrarily say that when the total deviation from average exceeds
    // 5% of the total module size estimates, it's too much.
    const average = totalModuleSize / max
    let totalDeviation = 0.0
    for (var i = 0; i < max; i++) {
      pattern = this.possibleCenters[i]
      totalDeviation += Math.abs(pattern.EstimatedModuleSize - average)
    }
    return totalDeviation <= 0.05 * totalModuleSize
  }

  this.findFinderPattern = function (image) {
    const tryHarder = false
    this.image = image
    const maxI = qrcode.height
    const maxJ = qrcode.width
    let iSkip = Math.floor((3 * maxI) / (4 * MAX_MODULES))
    if (iSkip < MIN_SKIP || tryHarder) {
      iSkip = MIN_SKIP
    }

    let done = false
    const stateCount = new Array(5)
    for (let i = iSkip - 1; i < maxI && !done; i += iSkip) {
      // Get a row of black/white values
      stateCount[0] = 0
      stateCount[1] = 0
      stateCount[2] = 0
      stateCount[3] = 0
      stateCount[4] = 0
      let currentState = 0
      for (let j = 0; j < maxJ; j++) {
        if (image[j + i * qrcode.width]) {
          // Black pixel
          if ((currentState & 1) == 1) {
            // Counting white pixels
            currentState++
          }
          stateCount[currentState]++
        } else {
          // White pixel
          if ((currentState & 1) == 0) {
            // Counting black pixels
            if (currentState == 4) {
              // A winner?
              if (this.foundPatternCross(stateCount)) {
                // Yes
                var confirmed = this.handlePossibleCenter(stateCount, i, j)
                if (confirmed) {
                  // Start examining every other line. Checking each line turned out to be too
                  // expensive and didn't improve performance.
                  iSkip = 2
                  if (this.hasSkipped) {
                    done = this.haveMultiplyConfirmedCenters()
                  } else {
                    const rowSkip = this.findRowSkip()
                    if (rowSkip > stateCount[2]) {
                      // Skip rows between row of lower confirmed center
                      // and top of presumed third confirmed center
                      // but back up a bit to get a full chance of detecting
                      // it, entire width of center of finder pattern

                      // Skip by rowSkip, but back off by stateCount[2] (size of last center
                      // of pattern we saw) to be conservative, and also back off by iSkip which
                      // is about to be re-added
                      i += rowSkip - stateCount[2] - iSkip
                      j = maxJ - 1
                    }
                  }
                } else {
                  // Advance to next black pixel
                  do {
                    j++
                  }
                  while (j < maxJ && !image[j + i * qrcode.width])
                  j--  // back up to that last white pixel
                }
                // Clear state to start looking again
                currentState = 0
                stateCount[0] = 0
                stateCount[1] = 0
                stateCount[2] = 0
                stateCount[3] = 0
                stateCount[4] = 0
              } else {
                // No, shift counts back by two
                stateCount[0] = stateCount[2]
                stateCount[1] = stateCount[3]
                stateCount[2] = stateCount[4]
                stateCount[3] = 1
                stateCount[4] = 0
                currentState = 3
              }
            } else {
              stateCount[++currentState]++
            }
          } else {
            // Counting white pixels
            stateCount[currentState]++
          }
        }
      }
      if (this.foundPatternCross(stateCount)) {
        var confirmed = this.handlePossibleCenter(stateCount, i, maxJ)
        if (confirmed) {
          iSkip = stateCount[0]
          if (this.hasSkipped) {
            // Found a third one
            done = this.haveMultiplyConfirmedCenters()
          }
        }
      }
    }

    const patternInfo = this.selectBestPatterns()
    qrcode_.orderBestPatterns(patternInfo)

    return new FinderPatternInfo(patternInfo)
  }
}

export {FinderPattern, FinderPatternInfo, FinderPatternFinder}