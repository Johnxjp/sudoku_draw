import torch
from torchvision import transforms
import numpy as np
from PIL import Image, ImageOps
import cv2 as cv


IMG_HEIGHT = 28
IMG_WIDTH = 28
PADDING = 50


def preprocess(img: np.ndarray) -> Image:
    """Center and crops grayscale image. Background is black"""
    _, thresh = cv.threshold(img, 127, 255, 0)
    contours, _ = cv.findContours(thresh, 1, 2)
    if len(contours) > 0:
        # select biggest area
        contour_id = np.argmax([cv.contourArea(c) for c in contours])
        x, y, w, h = cv.boundingRect(contours[contour_id])

        # Crop and pad image to square
        img = img[y : y + h, x : x + w]
        largest_dim = max(img.shape)
        img = Image.fromarray(img)

    # Resize to be square
    img = ImageOps.pad(img, (largest_dim, largest_dim), color=0)
    img = ImageOps.expand(img, border=PADDING, fill=0)
    img = img.resize((IMG_WIDTH, IMG_WIDTH))
    return img


def to_tensor_and_normalise(img):
    transform = transforms.Compose(
        [transforms.ToTensor(), transforms.Normalize((0.1307,), (0.3081,))]
    )
    return transform(img)


def mc_dropout_predictions(model, img, iterations=100):
    """
    Get class predictions with MC Dropout
    """
    model.train()
    # Save image locally
    # save_img = transforms.ToPILImage()(img)
    # save_img.save("./backend/imageToSave28.png", format="png")
    imgs = img.repeat(iterations, 1, 1, 1)
    predictions = model(imgs)
    classes = torch.argmax(predictions, axis=-1).squeeze()
    return classes.numpy()


def get_prediction(model, img) -> int:
    """
    Returns single prediction from model
    """
    iterations = 100
    uncertainty_level = 0.8
    uncertain_prediction = -1
    img = preprocess(img)
    img = to_tensor_and_normalise(img)
    predictions = mc_dropout_predictions(model, img, iterations)
    prob_counts = get_prob_counts(predictions)
    max_count = 0
    best_digit = None
    for digit, count in prob_counts:
        if count > max_count:
            max_count = count
            best_digit = digit

    frac_predicted = max_count / iterations
    if frac_predicted >= uncertainty_level:
        return int(best_digit), prob_counts

    return uncertain_prediction, prob_counts


def get_prob_counts(predictions):
    return [
        (digit, len(np.where(digit == predictions)[0])) for digit in range(10)
    ]
