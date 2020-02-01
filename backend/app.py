import torch
from torch_train import CNN
from flask import Flask, request
from flask_cors import CORS
from PIL import Image
import numpy as np
import base64

from predict import get_prediction

model = CNN()
model.load_state_dict(torch.load("../model/cnn_aug.pt"))
model.train()

app = Flask(__name__)
CORS(app)


IMG_HEIGHT = 28
IMG_WIDTH = 28


def convert_img_data(base64_encoded_img_str):
    img_bytes = str.encode(base64_encoded_img_str)
    return base64.decodebytes(img_bytes)


@app.route("/predict", methods=["POST"])
def predict():
    encoded_str = request.get_json().get("data")
    if encoded_str is None or not isinstance(encoded_str, str):
        return "Bad Format", 400

    print(encoded_str)
    encoded_img = convert_img_data(encoded_str)
    with open("imageToSave.png", "wb") as fh:
        fh.write(encoded_img)

    # Decode and convert to greyscale
    img = Image.open(Image.io.BytesIO(encoded_img)).getchannel("A")
    print(np.asarray(img).shape)
    # img = img.resize((IMG_HEIGHT, IMG_WIDTH))
    # img.save("imageToSave28.png", format="png")
    # img = np.asarray(img)
    # img = preprocess_predict(img)
    pred = get_prediction(model, img)
    return {"prediction": pred}, 200


if __name__ == "__main__":
    app.run(host="localhost", port=3001, debug=True)