export function deepCopyArray(arr) {
  return JSON.parse(JSON.stringify(arr));
}

export function parseBase64String(context) {
  let base64Data = context.drawing.canvas.toDataURL();
  return base64Data.match(/base64,(.*)/)[1];
}


export async function predictDigit(base64ImageData) {
  const url = "http://localhost:3001/predict";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "http://localhost/3001"
    },
    body: JSON.stringify({ data: base64ImageData })
  });
  return await response.json();
}