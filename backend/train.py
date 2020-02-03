import torch
import torchvision
from torchvision import transforms
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
import numpy as np

from model import MNIST_CNN


def load_data():
    transform = transforms.Compose(
        [
            transforms.RandomAffine(degrees=(-30, 30), translate=(0.2, 0.2)),
            transforms.ToTensor(),
            transforms.Normalize((0.1307,), (0.3081,)),
        ]
    )
    train = torchvision.datasets.MNIST(
        "./model", train=True, download=True, transform=transform
    )
    test = torchvision.datasets.MNIST(
        "./model", train=False, download=True, transform=transform
    )
    return train, test


def train_step(model, train_dl, loss, optimiser):
    model.train()
    train_losses = []
    train_correct = 0
    train_total = 0
    for x, y in train_dl:
        optimiser.zero_grad()
        out = model(x)
        loss = loss_criterion(out, y)
        loss.backward()
        optimiser.step()
        train_losses.append(loss.item())
        train_correct += torch.sum(torch.argmax(out, dim=-1) == y).item()
        train_total += len(y)

    train_acc = train_correct / train_total
    return train_losses, train_acc


def test_step(model, test_dl, loss):
    model.eval()
    test_losses = []
    test_correct = 0
    test_total = 0
    with torch.no_grad():
        for x, y in test_dl:
            out = model(x)
            loss = loss_criterion(out, y)
            test_losses.append(loss.item())
            test_correct += torch.sum(torch.argmax(out, dim=-1) == y).item()
            test_total += len(y)

    test_acc = test_correct / test_total
    return test_losses, test_acc


if __name__ == "__main__":
    train, test = load_data()
    batch_size = 64
    shuffle = True
    train_dl = DataLoader(train, batch_size=batch_size, shuffle=shuffle)
    test_dl = DataLoader(test, batch_size=batch_size, shuffle=shuffle)

    loss_criterion = nn.CrossEntropyLoss()
    model = MNIST_CNN()
    optimiser = optim.Adam(model.parameters())

    epochs = 15
    for e in range(epochs):
        print(f"Epoch {e}...", end=" ", flush=True)
        train_losses, train_acc = train_step(
            model, train_dl, loss_criterion, optimiser
        )
        test_losses, test_acc = test_step(model, train_dl, loss_criterion)

        print(
            f"Train Loss: {np.mean(train_losses):.3f} "
            f"Train Acc: {train_acc:.3f} "
            f"Test Loss: {np.mean(test_losses):.3f} "
            f"Test Acc: {test_acc:.3f} "
        )

    torch.save(model.state_dict(), "./model/cnn_aug.pt")
