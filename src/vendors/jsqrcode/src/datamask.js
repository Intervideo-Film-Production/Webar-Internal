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

const DataMask_ = {}

DataMask_.forReference = function (reference) {
  if (reference < 0 || reference > 7) {
    throw 'System.ArgumentException'
  }
  return DataMask_.DATA_MASKS[reference]
}

function DataMask000() {
  this.unmaskBitMatrix = function (bits, dimension) {
    for (let i = 0; i < dimension; i++) {
      for (let j = 0; j < dimension; j++) {
        if (this.isMasked(i, j)) {
          bits.flip(j, i)
        }
      }
    }
  }
  this.isMasked = function (i, j) {
    return ((i + j) & 0x01) == 0
  }
}

function DataMask001() {
  this.unmaskBitMatrix = function (bits, dimension) {
    for (let i = 0; i < dimension; i++) {
      for (let j = 0; j < dimension; j++) {
        if (this.isMasked(i, j)) {
          bits.flip(j, i)
        }
      }
    }
  }
  this.isMasked = function (i, j) {
    return (i & 0x01) == 0
  }
}

function DataMask010() {
  this.unmaskBitMatrix = function (bits, dimension) {
    for (let i = 0; i < dimension; i++) {
      for (let j = 0; j < dimension; j++) {
        if (this.isMasked(i, j)) {
          bits.flip(j, i)
        }
      }
    }
  }
  this.isMasked = function (i, j) {
    return j % 3 == 0
  }
}

function DataMask011() {
  this.unmaskBitMatrix = function (bits, dimension) {
    for (let i = 0; i < dimension; i++) {
      for (let j = 0; j < dimension; j++) {
        if (this.isMasked(i, j)) {
          bits.flip(j, i)
        }
      }
    }
  }
  this.isMasked = function (i, j) {
    return (i + j) % 3 == 0
  }
}

function DataMask100() {
  this.unmaskBitMatrix = function (bits, dimension) {
    for (let i = 0; i < dimension; i++) {
      for (let j = 0; j < dimension; j++) {
        if (this.isMasked(i, j)) {
          bits.flip(j, i)
        }
      }
    }
  }
  this.isMasked = function (i, j) {
    return (((URShift(i, 1)) + (j / 3)) & 0x01) == 0
  }
}

function DataMask101() {
  this.unmaskBitMatrix = function (bits, dimension) {
    for (let i = 0; i < dimension; i++) {
      for (let j = 0; j < dimension; j++) {
        if (this.isMasked(i, j)) {
          bits.flip(j, i)
        }
      }
    }
  }
  this.isMasked = function (i, j) {
    const temp = i * j
    return (temp & 0x01) + (temp % 3) == 0
  }
}

function DataMask110() {
  this.unmaskBitMatrix = function (bits, dimension) {
    for (let i = 0; i < dimension; i++) {
      for (let j = 0; j < dimension; j++) {
        if (this.isMasked(i, j)) {
          bits.flip(j, i)
        }
      }
    }
  }
  this.isMasked = function (i, j) {
    const temp = i * j
    return (((temp & 0x01) + (temp % 3)) & 0x01) == 0
  }
}
function DataMask111() {
  this.unmaskBitMatrix = function (bits, dimension) {
    for (let i = 0; i < dimension; i++) {
      for (let j = 0; j < dimension; j++) {
        if (this.isMasked(i, j)) {
          bits.flip(j, i)
        }
      }
    }
  }
  this.isMasked = function (i, j) {
    return ((((i + j) & 0x01) + ((i * j) % 3)) & 0x01) == 0
  }
}

DataMask_.DATA_MASKS = new Array(new DataMask000(), new DataMask001(), new DataMask010(), new DataMask011(), new DataMask100(), new DataMask101(), new DataMask110(), new DataMask111())

const DataMask = DataMask_

export {DataMask}