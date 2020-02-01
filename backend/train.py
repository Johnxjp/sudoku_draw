import torch
import torchvision
from torchvision import transforms
import torch.nn as nn
import torch.optim as optim
import torch.nn.functional as F
from torch.utils.data import DataLoader
import numpy as np


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


class CNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.img_h = 28
        self.img_w = 28
        self.out_channels = 32
        self.conv1 = nn.Conv2d(1, self.out_channels, 3)
        self.pool1 = nn.MaxPool2d(2, 2)
        self.flat = nn.Flatten()
        self.fc1 = nn.Linear(13 * 13 * self.out_channels, 128)
        self.fc2 = nn.Linear(128, 10)
        self.dropout = nn.Dropout(p=0.5)

    def forward(self, x):
        x = self.pool1(F.relu(self.conv1(x)))
        x = self.flat(x)
        x = self.fc1(x)
        x = self.dropout(x)
        x = self.fc2(x)
        return x


if __name__ == "__main__":
    train, test = load_data()
    batch_size = 64
    shuffle = True
    train_dl = DataLoader(train, batch_size=batch_size, shuffle=shuffle)
    test_dl = DataLoader(test, batch_size=batch_size, shuffle=shuffle)

    loss_criterion = nn.CrossEntropyLoss()
    model = CNN()
    optimiser = optim.Adam(model.parameters())

    epochs = 15
    for e in range(epochs):
        print(f"Epoch {e}...", end=" ", flush=True)
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

        model.eval()
        test_losses = []
        test_correct = 0
        test_total = 0
        with torch.no_grad():
            for x, y in test_dl:
                out = model(x)
                loss = loss_criterion(out, y)
                test_losses.append(loss.item())
                test_correct += torch.sum(
                    torch.argmax(out, dim=-1) == y
                ).item()
                test_total += len(y)

        print(
            f"Train Loss: {np.mean(train_losses):.3f} "
            f"Train Acc: {train_correct / train_total:.3f} "
            f"Test Loss: {np.mean(test_losses):.3f} "
            f"Test Acc: {test_correct / test_total:.3f} "
        )

    torch.save(model.state_dict(), "./model/cnn_aug.pt")
