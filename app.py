# from flask import Flask, render_template, request, Response
# from flask_restful import Resource, Api, reqparse

# app = Flask(__name__)
# api = Api(app)


# @app.route('/', methods=['GET'])
# def home():
#     return render_template('home.html')


# @app.route('/upload', methods=['POST'])
# def post():
#     data = request.form
#     print(data)
#     # with open("templates\image.jpg", "rb") as f:
#     with open(data.get(), "rb") as f:
#         image_data = f.read()
#     return Response(image_data, content_type="image/jpeg")
#     # return render_template('pics.html')
#     # return render_template('pics.html')


# @app.route("/image")
# def image():
#     with open("templates\image.jpg", "rb") as f:
#         image_data = f.read()
#     return Response(image_data, content_type="image/jpeg")


# @app.route("/image", methods=["POST"])
# def image():
#     image = request.files["templates\image.jpg"]
#     image_data = image.read()
#     return jsonify({"status": "success", "image_data": base64.b64encode(image_data).decode()})
#     # return Response(image_data, content_type="image/jpeg")


from werkzeug.utils import secure_filename
from flask import Flask, render_template, request, redirect, url_for, abort
import os
from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/', methods=['POST'])
def upload_file():
    uploaded_file = request.files['file']
    if uploaded_file.filename != '':
        uploaded_file.save(uploaded_file.filename)
    # return redirect(url_for('index'))
    return uploaded_file.send(uploaded_file)


if __name__ == '__main__':
    app.run(debug=True)
