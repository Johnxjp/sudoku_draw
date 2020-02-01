import torch
from torchvision import transforms
import numpy as np


def convert_img(image):
    transform = transforms.Compose(
        [
            transforms.Pad(15),
            transforms.Resize((28, 28)),
            transforms.ToTensor(),
            transforms.Normalize((0.1307,), (0.3081,)),
        ]
    )
    return transform(image)


def mc_dropout_predictions(model, image, iterations=100):
    """
    Get class predictions with MC Dropout
    """
    model.train()
    image = convert_img(image)
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
