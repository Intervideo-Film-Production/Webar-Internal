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

function BitMatrix(width, height) {
  if (!height) {
    height = width
  }
  if (width < 1 || height < 1) {
    throw 'Both dimensions must be greater than 0'
  }
  this.width = width
  this.height = height
  let rowSize = width >> 5
  if ((width & 0x1f) != 0) {
    rowSize++
  }
  this.rowSize = rowSize
  this.bits = new Array(rowSize * height)
  for (let i = 0; i < this.bits.length; i++) {
    this.bits[i] = 0
  }

  this.__defineGetter__('Width', function () {
    return this.width
  })
  this.__defineGetter__('Height', function () {
    return this.height
  })
  this.__defineGetter__('Dimension', function () {
    if (this.width != this.height) {
      throw 'Can\'t call getDimension() on a non-square matrix'
    }
    return this.width
  })

  this.get_Renamed = function (x, y) {
    const offset = y * this.rowSize + (x >> 5)
    return ((URShift(this.bits[offset], (x & 0x1f))) & 1) != 0
  }
  this.set_Renamed = function (x, y) {
    const offset = y * this.rowSize + (x >> 5)
    this.bits[offset] |= 1 << (x & 0x1f)
  }
  this.flip = function (x, y) {
    const offset = y * this.rowSize + (x >> 5)
    this.bits[offset] ^= 1 << (x & 0x1f)
  }
  this.clear = function () {
    const max = this.bits.length
    for (let i = 0; i < max; i++) {
      this.bits[i] = 0
    }
  }
  this.setRegion = function (left, top, width, height) {
    if (top < 0 || left < 0) {
      throw 'Left and top must be nonnegative'
    }
    if (height < 1 || width < 1) {
      throw 'Height and width must be at least 1'
    }
    const right = left + width
    const bottom = top + height
    if (bottom > this.height || right > this.width) {
      throw 'The region must fit inside the matrix'
    }
    for (let y = top; y < bottom; y++) {
      const offset = y * this.rowSize
      for (let x = left; x < right; x++) {
        this.bits[offset + (x >> 5)] |= 1 << (x & 0x1f)
      }
    }
  }
}

export {BitMatrix}