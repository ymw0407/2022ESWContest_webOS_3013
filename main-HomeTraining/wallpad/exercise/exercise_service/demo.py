import pickle
st = {1: (65, [2, 7, 7, 7, 7, 6, 7, 6, 4, 3, 4, 3, 3]), 2: [12345]}

with open('./demo_data.txt', 'wb') as data:
    pickle.dump(st, data)