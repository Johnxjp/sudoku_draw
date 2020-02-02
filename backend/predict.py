import torch
from torchvision import transforms
import numpy as np
from PIL import Image, ImageOps
import cv2 as cv


IMG_HEIGHT = 28
IMG_WIDTH = 28
PADDING = 50


def preprocess(grayscale_image: np.ndarray) -> Image:
    """Center and crops grayscale image. Background is black"""
    _, thresh = cv.threshold(grayscale_image, 127, 255, 0)
    contours, _ = cv.findContours(thresh, 1, 2)

    # select biggest area
    contour_id = np.argmax([cv.contourArea(c) for c in contours])
    x, y, w, h = cv.boundingRect(contours[contour_id])

    # Crop and pad image to square
    cropped_img = grayscale_image[y : y + h, x : x + w]
    largest_dim = max(cropped_img.shape)
    new_img = Image.fromarray(cropped_img)

    # Resize to be square
    new_img = ImageOps.pad(new_img, (largest_dim, largest_dim), color=0)
    new_img = ImageOps.expand(new_img, border=PADDING, fill=0)
    new_img = new_img.resize((IMG_WIDTH, IMG_WIDTH))
    return new_img


def to_tensor_and_normalise(image):
    transform = transforms.Compose(
        [transforms.ToTensor(), transforms.Normalize((0.1307,), (0.3081,))]
    )
    return transform(image)


def mc_dropout_predictions(model, image, iterations=100):
    """
    Get class predictions with MC Dropout
    """
    model.train()
    save_img = transforms.ToPILImage()(image)
    save_img.save("imageToSave28.png", format="png")
    images = image.repeat(iterations, 1, 1, 1)
    print(images.size())
    predictions = model(images)
    classes = torch.argmax(predictions, axis=-1).squeeze()
    print("Classes", classes.shape)
    return classes.numpy()


def get_prediction(model, image) -> int:
    """
    Returns single prediction from model
    """
    iterations = 100
    uncertainty_level = 0.8
    uncertain_prediction = -1
    image = preprocess(image)
    image = to_tensor_and_normalise(image)
    predictions = mc_dropout_predictions(model, image, iterations)
    print(predictions)
    unique, counts = np.unique(predictions, return_counts=True)

    max_count = 0
    best_digit = None
    for digit, count in zip(unique, counts):
        print(digit, count)
        if count > max_count:
            max_count = count
            best_digit = digit

    print("N predicted", max_count)
    frac_predicted = max_count / iterations
    if frac_predicted >= uncertainty_level:
        return int(best_digit)

    return uncertain_prediction
