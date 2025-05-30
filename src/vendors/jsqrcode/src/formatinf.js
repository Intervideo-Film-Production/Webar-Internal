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

import {URShift} from './qrcode'
import {ErrorCorrectionLevel} from './errorlevel'

const FORMAT_INFO_MASK_QR = 0x5412
const FORMAT_INFO_DECODE_LOOKUP = new Array(new Array(0x5412, 0x00), new Array(0x5125, 0x01), new Array(0x5E7C, 0x02), new Array(0x5B4B, 0x03), new Array(0x45F9, 0x04), new Array(0x40CE, 0x05), new Array(0x4F97, 0x06), new Array(0x4AA0, 0x07), new Array(0x77C4, 0x08), new Array(0x72F3, 0x09), new Array(0x7DAA, 0x0A), new Array(0x789D, 0x0B), new Array(0x662F, 0x0C), new Array(0x6318, 0x0D), new Array(0x6C41, 0x0E), new Array(0x6976, 0x0F), new Array(0x1689, 0x10), new Array(0x13BE, 0x11), new Array(0x1CE7, 0x12), new Array(0x19D0, 0x13), new Array(0x0762, 0x14), new Array(0x0255, 0x15), new Array(0x0D0C, 0x16), new Array(0x083B, 0x17), new Array(0x355F, 0x18), new Array(0x3068, 0x19), new Array(0x3F31, 0x1A), new Array(0x3A06, 0x1B), new Array(0x24B4, 0x1C), new Array(0x2183, 0x1D), new Array(0x2EDA, 0x1E), new Array(0x2BED, 0x1F))
const BITS_SET_IN_HALF_BYTE = new Array(0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4)

function FormatInformation(formatInfo) {
  this.errorCorrectionLevel = ErrorCorrectionLevel.forBits((formatInfo >> 3) & 0x03)
  this.dataMask = (formatInfo & 0x07)

  this.__defineGetter__('ErrorCorrectionLevel', function () {
    return this.errorCorrectionLevel
  })
  this.__defineGetter__('DataMask', function () {
    return this.dataMask
  })
  this.GetHashCode = function () {
    return (this.errorCorrectionLevel.ordinal() << 3) | this.dataMask
  }
  this.Equals = function (o) {
    const other = o
    return this.errorCorrectionLevel == other.errorCorrectionLevel && this.dataMask == other.dataMask
  }
}

FormatInformation.numBitsDiffering = function (a, b) {
  a ^= b  // a now has a 1 bit exactly where its bit differs with b's
  // Count bits set quickly with a series of lookups:
  return BITS_SET_IN_HALF_BYTE[a & 0x0F] + BITS_SET_IN_HALF_BYTE[(URShift(a, 4) & 0x0F)] + BITS_SET_IN_HALF_BYTE[(URShift(a, 8) & 0x0F)] + BITS_SET_IN_HALF_BYTE[(URShift(a, 12) & 0x0F)] + BITS_SET_IN_HALF_BYTE[(URShift(a, 16) & 0x0F)] + BITS_SET_IN_HALF_BYTE[(URShift(a, 20) & 0x0F)] + BITS_SET_IN_HALF_BYTE[(URShift(a, 24) & 0x0F)] + BITS_SET_IN_HALF_BYTE[(URShift(a, 28) & 0x0F)]
}

FormatInformation.decodeFormatInformation = function (maskedFormatInfo) {
  const formatInfo = FormatInformation.doDecodeFormatInformation(maskedFormatInfo)
  if (formatInfo != null) {
    return formatInfo
  }
  // Should return null, but, some QR codes apparently
  // do not mask this info. Try again by actually masking the pattern
  // first
  return FormatInformation.doDecodeFormatInformation(maskedFormatInfo ^ FORMAT_INFO_MASK_QR)
}
FormatInformation.doDecodeFormatInformation = function (maskedFormatInfo) {
  // Find the int in FORMAT_INFO_DECODE_LOOKUP with fewest bits differing
  let bestDifference = 0xffffffff
  let bestFormatInfo = 0
  for (let i = 0; i < FORMAT_INFO_DECODE_LOOKUP.length; i++) {
    const decodeInfo = FORMAT_INFO_DECODE_LOOKUP[i]
    const targetInfo = decodeInfo[0]
    if (targetInfo == maskedFormatInfo) {
      // Found an exact match
      return new FormatInformation(decodeInfo[1])
    }
    const bitsDifference = this.numBitsDiffering(maskedFormatInfo, targetInfo)
    if (bitsDifference < bestDifference) {
      bestFormatInfo = decodeInfo[1]
      bestDifference = bitsDifference
    }
  }
  // Hamming distance of the 32 masked codes is 7, by construction, so <= 3 bits
  // differing means we found a match
  if (bestDifference <= 3) {
    return new FormatInformation(bestFormatInfo)
  }
  return null
}

export {FormatInformation}