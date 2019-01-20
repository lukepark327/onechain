import json
from requests import get, post
import ast
from pprint import pprint


URL = "http://127.0.0.1"
PORT = 3001


def getBlockchain():
    op = "blocks"
    target = URL + ":" + str(PORT) + '/' + op

    res = get(target)
    return res

def addNewBlock(req=None):
    op = "mineBlock"
    target = URL + ":" + str(PORT) + '/' + op

    if req == None:
        res = post(target)
    else:
        headers = {'Content-type': 'application/json'}
        data = {"data": req}
        res = post(target, data=json.dumps(data), headers=headers)

    return res

def getPeers():
    op = "peers"
    target = URL + ":" + str(PORT) + '/' + op

    res = get(target)
    return res

def addPeer(req=None):
    op = "addPeer"
    target = URL + ":" + str(PORT) + '/' + op

    headers = {'Content-type': 'application/json'}
    data = {"peer": req}
    res = post(target, data=json.dumps(data), headers=headers)
    return res

def stopNode():
    op = "stop"
    target = URL + ":" + str(PORT) + '/' + op

    res = post(target)
    return res


if __name__ == '__main__':
    """
    res = getBlockchain()                       # pprint(ast.literal_eval(res.text)[0]['data'])
    res = addNewBlock(req="Anything") 
    res = getPeers()                            # pprint(ast.literal_eval(res.text)[0])
    res = addPeer(req="ws://127.0.0.1:6003")
    res = stopNode()                            # pprint(ast.literal_eval(res.text)['msg'])
    
    print(res.text)
    """
    pass
