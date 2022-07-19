import { qrcode } from 'src/vendors/jsqrcode/src/qrcode';

// Define a custom pipeline module. This module scans the camera feed for qr codes, and makes the
// result available to other modules in onUpdate. It requires that the CameraPixelArray module is
// installed and configured to provide a luminance (black and white) image.
const qrprocessPipelineModule = () => ({
  name: 'qrprocess',
  onProcessCpu: ({ processGpuResult }: { processGpuResult: any }) => {
    // Check whether there is any data ready to process.
    if (!processGpuResult.camerapixelarray || !processGpuResult.camerapixelarray.pixels) {
      return { found: false }
    }

    try {
      // Set input variables on the global qrcode object before calling qrcode.process().
      const { rows, cols } = processGpuResult.camerapixelarray
      qrcode.width = cols
      qrcode.height = rows
      qrcode.grayscale = () => processGpuResult.camerapixelarray.pixels
      const res = qrcode.process()  // Scan the image for a QR code.
      res.points = res.points.map(
        ({ x, y }: { x: number, y: number }) => ({ x: x / (cols - 1), y: y / (rows - 1) })
      )
      return res
    } catch (e) {
      return { found: false }  // jsqrcode throws errors when qr codes are not found in an image.
    }
  },
})

// Define a custom pipeline module. This module updates UI elements with the result of the QR code
// scanning, and navigates to the found url on any tap to the screen.
const qrdisplayPipelineModule = (
  overlayCanvas: HTMLCanvasElement | null,
  onUpdate?: (found: boolean, foundText: string) => void
) => {
  // const ctx_ = overlayCanvas?.getContext('2d') as CanvasRenderingContext2D;

  let canvas_: HTMLCanvasElement;

  // Keep the 2d drawing canvas in sync with the camera feed.
  const onCanvasSizeChange = () => {
    if (!!overlayCanvas) {
      overlayCanvas.width = canvas_.width;
      overlayCanvas.height = canvas_.height;
    }
  }

  return {
    name: 'qrdisplay',
    onStart: ({ canvas }: { canvas: HTMLCanvasElement }) => {
      canvas_ = canvas
    },
    onUpdate: (result: any) => {
      const { processCpuResult } = result;

      if (!processCpuResult.qrprocess) return;
      // FIXME: not sure whats going on here
      // if (overlayCanvas) {
      //   overlayCanvas.width = overlayCanvas.width;  // Clears canvas
      // }
      const { found, foundText } = processCpuResult.qrprocess;

      
      if (onUpdate) onUpdate(found, foundText);
    },
    onCanvasSizeChange,
  }
}

export { qrprocessPipelineModule, qrdisplayPipelineModule };


