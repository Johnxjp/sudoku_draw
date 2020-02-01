import tensorflow as tf


def normalise(x):
    return (x / 255.0) * 2 - 1


def preprocess_train(x):
    x = normalise(x)
    x = x[..., tf.newaxis]
    return x


def preprocess_predict(x):
    x = normalise(x)
    x = tf.convert_to_tensor(x, dtype=tf.float32)
    x = x[..., tf.newaxis]
    x = tf.expand_dims(x, 0)
    print(x.shape)
    return x
