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

import {GF256Poly} from './gf256poly'

function GF256(primitive) {
  this.expTable = new Array(256)
  this.logTable = new Array(256)
  let x = 1
  for (var i = 0; i < 256; i++) {
    this.expTable[i] = x
    x <<= 1  // x = x * 2; we're assuming the generator alpha is 2
    if (x >= 0x100) {
      x ^= primitive
    }
  }
  for (var i = 0; i < 255; i++) {
    this.logTable[this.expTable[i]] = i
  }
  // logTable[0] == 0 but this should never be used
  const at0 = new Array(1); at0[0] = 0
  this.zero = new GF256Poly(this, new Array(at0))
  const at1 = new Array(1); at1[0] = 1
  this.one = new GF256Poly(this, new Array(at1))

  this.__defineGetter__('Zero', function () {
    return this.zero
  })
  this.__defineGetter__('One', function () {
    return this.one
  })
  this.buildMonomial = function (degree, coefficient) {
    if (degree < 0) {
      throw 'System.ArgumentException'
    }
    if (coefficient == 0) {
      return this.zero
    }
    const coefficients = new Array(degree + 1)
    for (let i = 0; i < coefficients.length; i++)coefficients[i] = 0
    coefficients[0] = coefficient
    return new GF256Poly(this, coefficients)
  }
  this.exp = function (a) {
    return this.expTable[a]
  }
  this.log = function (a) {
    if (a == 0) {
      throw 'System.ArgumentException'
    }
    return this.logTable[a]
  }
  this.inverse = function (a) {
    if (a == 0) {
      throw 'System.ArithmeticException'
    }
    return this.expTable[255 - this.logTable[a]]
  }
  this.multiply = function (a, b) {
    if (a == 0 || b == 0) {
      return 0
    }
    if (a == 1) {
      return b
    }
    if (b == 1) {
      return a
    }
    return this.expTable[(this.logTable[a] + this.logTable[b]) % 255]
  }
}

GF256.QR_CODE_FIELD = new GF256(0x011D)
GF256.DATA_MATRIX_FIELD = new GF256(0x012D)

GF256.addOrSubtract = function (a, b) {
  return a ^ b
}

export {GF256}