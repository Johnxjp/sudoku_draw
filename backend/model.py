import torch.nn as nn
import torch.nn.functional as F


class MNIST_CNN(nn.Module):
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
