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

import {BitMatrix} from './bitmat'
import {qrcode} from './qrcode'
import {PerspectiveTransform} from './detector';

const GridSampler_ = {}

GridSampler_.checkAndNudgePoints = function (image, points) {
  const {width} = qrcode
  const {height} = qrcode
  // Check and nudge points from start until we see some that are OK:
  let nudged = true
  for (var offset = 0; offset < points.length && nudged; offset += 2) {
    var x = Math.floor(points[offset])
    var y = Math.floor(points[offset + 1])
    if (x < -1 || x > width || y < -1 || y > height) {
      throw 'Error.checkAndNudgePoints '
    }
    nudged = false
    if (x == -1) {
      points[offset] = 0.0
      nudged = true
    } else if (x == width) {
      points[offset] = width - 1
      nudged = true
    }
    if (y == -1) {
      points[offset + 1] = 0.0
      nudged = true
    } else if (y == height) {
      points[offset + 1] = height - 1
      nudged = true
    }
  }
  // Check and nudge points from end:
  nudged = true
  for (var offset = points.length - 2; offset >= 0 && nudged; offset -= 2) {
    var x = Math.floor(points[offset])
    var y = Math.floor(points[offset + 1])
    if (x < -1 || x > width || y < -1 || y > height) {
      throw 'Error.checkAndNudgePoints '
    }
    nudged = false
    if (x == -1) {
      points[offset] = 0.0
      nudged = true
    } else if (x == width) {
      points[offset] = width - 1
      nudged = true
    }
    if (y == -1) {
      points[offset + 1] = 0.0
      nudged = true
    } else if (y == height) {
      points[offset + 1] = height - 1
      nudged = true
    }
  }
}

GridSampler_.sampleGrid3 = function (image, dimension, transform) {
  const bits = new BitMatrix(dimension)
  const points = new Array(dimension << 1)
  for (let y = 0; y < dimension; y++) {
    const max = points.length
    const iValue = y + 0.5
    for (var x = 0; x < max; x += 2) {
      points[x] = (x >> 1) + 0.5
      points[x + 1] = iValue
    }
    transform.transformPoints1(points)
    // Quick check to see if points transformed to something inside the image;
    // sufficient to check the endpoints
    GridSampler_.checkAndNudgePoints(image, points)
    try {
      for (var x = 0; x < max; x += 2) {
        // var xpoint = (Math.floor( points[x]) * 4) + (Math.floor( points[x + 1]) * qrcode.width * 4);
        const bit = image[Math.floor(points[x]) + qrcode.width * Math.floor(points[x + 1])]
        // qrcode.imagedata.data[xpoint] = bit?255:0;
        // qrcode.imagedata.data[xpoint+1] = bit?255:0;
        // qrcode.imagedata.data[xpoint+2] = 0;
        // qrcode.imagedata.data[xpoint+3] = 255;
        // bits[x >> 1][ y]=bit;
        if (bit) {
          bits.set_Renamed(x >> 1, y)
        }
      }
    } catch (aioobe) {
      // This feels wrong, but, sometimes if the finder patterns are misidentified, the resulting
      // transform gets "twisted" such that it maps a straight line of points to a set of points
      // whose endpoints are in bounds, but others are not. There is probably some mathematical
      // way to detect this about the transformation that I don't know yet.
      // This results in an ugly runtime exception despite our clever checks above -- can't have
      // that. We could check each point's coordinates but that feels duplicative. We settle for
      // catching and wrapping ArrayIndexOutOfBoundsException.
      throw 'Error.checkAndNudgePoints'
    }
  }
  return bits
}

GridSampler_.sampleGridx = function (image, dimension, p1ToX, p1ToY, p2ToX, p2ToY, p3ToX, p3ToY, p4ToX, p4ToY, p1FromX, p1FromY, p2FromX, p2FromY, p3FromX, p3FromY, p4FromX, p4FromY) {
  const transform = PerspectiveTransform.quadrilateralToQuadrilateral(p1ToX, p1ToY, p2ToX, p2ToY, p3ToX, p3ToY, p4ToX, p4ToY, p1FromX, p1FromY, p2FromX, p2FromY, p3FromX, p3FromY, p4FromX, p4FromY)

  return GridSampler_.sampleGrid3(image, dimension, transform)
}

const GridSampler = GridSampler_

export {GridSampler}