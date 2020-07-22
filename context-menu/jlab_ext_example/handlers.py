import os
import json

from notebook.base.handlers import APIHandler
from notebook.utils import url_path_join

import tornado
from tornado.web import StaticFileHandler

from sys import stdin, stdout
from pathlib import Path

from cimdev.pb_io import load_pb,dump_pb

try:
    from cimdev.onnx import load_onnx
except ImportError:
    from cimdev.onnx import ModelProto
    from cimdev.onnx_dot import onnx_to_dot

    def load_onnx(source, format=None):
        data = Path(source)
        return load_pb(ModelProto, data, format=format)

try:
    from cimdev.cimprog import load_cimprog
except ImportError:
    from cimdev.cimprog_pb2 import CimProgProto
    from cimdev.cimprog_dot import cimprog_to_dot

    def load_cimprog(source, format=None):
        data = Path(source)
        return load_pb(CimProgProto, data, format=format)

try:
    from cimdev.cimdev import load_cimdev
except ImportError:
    from cimdev.cimdev_pb2 import CimDevProto
    from cimdev.cimdev_dot import cimdev_to_dot

    def load_cimdev(source, format=None):
        data = Path(source)
        return load_pb(CimProgProto, data, format=format)

def load_unknown_proto(source):
    for proc in [load_cimdev, load_cimprog, load_onnx]:
        try:
            msg = proc(source)
        except Exception as e:
            continue
        else:
            break
    else:
        ignore()
    
    return msg

def unknown_proto_to_dot(msg):
    for proc in [cimdev_to_dot, cimprog_to_dot, onnx_to_dot]:
        try:
            dot = proc(msg)
            print("try")
        except Exception as e:
            continue
        else:
            break
    else:
        ignore()
    
    return dot

class RouteHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
    @tornado.web.authenticated
    def post(self):
        # input_data is a dictionnary
        input_data = self.get_json_body()
        source = input_data["source"]
        target = input_data["target"]
        sformat = input_data["sformat"]
        tformat = input_data["tformat"]
        if sformat == "onnx":
            msg = load_onnx(source)
            if tformat == "yaml":
                data = dump_pb(msg,target,tformat)
            elif tformat == "dot":
                dot = onnx_to_dot(msg)
                dot.format = "png"
                dot.render(target,view=False)
        elif sformat == "pb":
            msg = load_unknown_proto(source)
            if tformat == "yaml":
                data = dump_pb(msg,target,tformat)   
            elif tformat == "dot":
                dot = unknown_proto_to_dot(msg)
                dot.format = "png"
                dot.render(target,view=False)
        elif sformat == "yaml":
            msg = load_unknown_proto(source)
            if tformat == "pb":
                data = dump_pb(msg,target,tformat)
            if tformat == "dot":
                dot = unknown_proto_to_dot(msg)
                dot.format = "png"
                dot.render(target,view=False)

        data = {"result": "Convert to {} successfully!".format("image" if tformat=="dot" else tformat)}
        self.finish(json.dumps(data))

def setup_handlers(web_app, url_path):
    host_pattern = ".*$"
    base_url = web_app.settings["base_url"]

    # Prepend the base_url so that it works in a jupyterhub setting
    route_pattern = url_path_join(base_url, url_path, "convert")
    handlers = [(route_pattern, RouteHandler)]
    web_app.add_handlers(host_pattern, handlers)

    # Prepend the base_url so that it works in a jupyterhub setting
    doc_url = url_path_join(base_url, url_path, "static")
    doc_dir = os.getenv(
        "JLAB_SERVER_EXAMPLE_STATIC_DIR",
        os.path.join(os.path.dirname(__file__), "static"),
    )
    handlers = [("{}/(.*)".format(doc_url), StaticFileHandler, {"path": doc_dir})]
    web_app.add_handlers(".*$", handlers)
