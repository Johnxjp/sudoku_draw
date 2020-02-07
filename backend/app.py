import torch
from model import MNIST_CNN
from flask import Flask, request, render_template
from flask_cors import CORS
from PIL import Image
import numpy as np
import base64

from predict import get_prediction
from config import MODEL_FILE

model = MNIST_CNN()
model.load_state_dict(torch.load(MODEL_FILE))
model.train()

app = Flask(
    __name__, static_folder="../build/static", template_folder="../build",
)
CORS(app)


def convert_img_data(base64_encoded_img_str):
    img_bytes = str.encode(base64_encoded_img_str)
    return base64.decodebytes(img_bytes)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():
    encoded_str = request.get_json().get("data")
    if encoded_str is None or not isinstance(encoded_str, str):
        return "Bad Format", 400

    encoded_img = convert_img_data(encoded_str)
    # Save image locally
    # with open("./backend/imageToSave.png", "wb") as fh:
    #     fh.write(encoded_img)

    # Decode and convert to greyscale. All information is in the alpha channel
    img = Image.open(Image.io.BytesIO(encoded_img)).getchannel("A")
    img = np.asarray(img)
    pred, probabilities = get_prediction(model, img)
    return {"prediction": pred, "probabilities": probabilities}, 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3001, debug=False)
