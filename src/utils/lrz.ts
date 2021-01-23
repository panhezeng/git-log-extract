/**
 * 转换成formdata
 * @param dataURI
 * @returns {*}
 *
 * @source http://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata
 */
function dataURItoBlob(dataURI: string) {
  // convert base64/URLEncoded data component to raw binary data held in a string
  let byteString;
  if (dataURI.split(",")[0].indexOf("base64") >= 0)
    byteString = atob(dataURI.split(",")[1]);
  else byteString = unescape(dataURI.split(",")[1]);

  // separate out the mime component
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // write the bytes of the string to a typed array
  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia.buffer], { type: mimeString });
}

function getResize(img: HTMLImageElement, width: number, height: number) {
  const ret = {
    width: img.width,
    height: img.height,
  };

  // 如果原图小于设定，采用原图
  if (ret.width < width || ret.height < height) {
    return ret;
  }

  const scale = ret.width / ret.height;

  if (width && height) {
    if (scale >= width / height) {
      if (ret.width > width) {
        ret.width = width;
        ret.height = Math.ceil(width / scale);
      }
    } else {
      if (ret.height > height) {
        ret.height = height;
        ret.width = Math.ceil(height * scale);
      }
    }
  } else if (width) {
    if (width < ret.width) {
      ret.width = width;
      ret.height = Math.ceil(width / scale);
    }
  } else if (height) {
    if (height < ret.height) {
      ret.width = Math.ceil(height * scale);
      ret.height = height;
    }
  }

  // 超过这个值base64无法生成，在IOS上
  while (ret.width >= 3264 || ret.height >= 2448) {
    ret.width *= 0.8;
    ret.height *= 0.8;
  }
  return ret;
}

function createBase64(
  resize: { width: number; height: number },
  img: HTMLImageElement,
  canvas: HTMLCanvasElement,
  quality: number
) {
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.drawImage(img, 0, 0, resize.width, resize.height);
  }
  return new Promise(function (resolve) {
    resolve(canvas.toDataURL("image/jpeg", quality));
  });
}

function getBase64(
  img: HTMLImageElement,
  width: number,
  height: number,
  canvas: HTMLCanvasElement,
  quality: number
) {
  return new Promise(function (resolve) {
    const resize = getResize(img, width, height);
    canvas.width = resize.width;
    canvas.height = resize.height;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      // 设置为白色背景，jpg是不支持透明的，所以会被默认为canvas默认的黑色背景。
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    createBase64(resize, img, canvas, quality).then(resolve);
  });
}

const option = {
  width: NaN,
  height: NaN,
  fieldName: "file",
  quality: 0.7,
};

export default function (
  file: File | string,
  opts?: {
    width?: number;
    height?: number;
    fieldName?: string;
    quality?: number;
  }
) {
  if (!file) throw new Error("没有收到图片");
  let { width, height, fieldName, quality } = option;
  if (typeof opts !== "undefined") {
    if (opts.width) {
      width = opts.width;
    }
    if (opts.height) {
      height = opts.height;
    }
    if (opts.fieldName) {
      fieldName = opts.fieldName;
    }
    if (opts.quality) {
      quality = opts.quality;
    }
  }
  const img = new Image(),
    canvas = document.createElement("canvas") as HTMLCanvasElement;
  let fileIsBase64 = false,
    url = "",
    fileName = "";
  if (typeof file === "string") {
    fileIsBase64 = /^data:/.test(file);
    url = file;
    fileName = fileIsBase64 ? "base64.jpg" : file.split("/").pop() || "";
  } else if (/^\[object File]$/.test(Object.prototype.toString.call(file))) {
    url = URL.createObjectURL(file);
    fileName = (file as File).name;
  }

  if (!document.createElement("canvas").getContext) {
    throw new Error("浏览器不支持canvas");
  }

  return new Promise(function (resolve, reject) {
    img.onerror = function () {
      const err = new Error("加载图片文件失败");
      reject(err);
      throw err;
    };

    img.onload = function () {
      getBase64(img, width, height, canvas, quality)
        .then(function (base64: any) {
          if (base64.length < 10) {
            const err = new Error("生成base64失败");
            reject(err);
            throw err;
          }
          return base64;
        })
        .then(function (base64: any) {
          const formData = new FormData();

          if (
            typeof file === "string" ||
            /^\[object Blob]$/.test(Object.prototype.toString.call(file))
          ) {
            formData.append(
              fieldName,
              dataURItoBlob(base64),
              fileName.replace(/\..+/g, ".jpg")
            );
          }
          resolve({
            formData: formData,
            base64: base64,
            base64Len: base64.length,
            origin: file,
            file: file,
          });
          URL.revokeObjectURL(url);
        });
    };
    // 如果传入的是base64在移动端会报错
    !fileIsBase64 && (img.crossOrigin = "*");
    img.src = url;
  });
}
