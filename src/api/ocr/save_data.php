<?php

# tfjs-examples\mnist から学習済みデータを受け取り、ファイルとして保存するAPI

header("Access-Control-Allow-Origin: *");

move_uploaded_file($_FILES['model_json']['tmp_name'], "trained_data/model.json");
move_uploaded_file($_FILES['model_weights_bin']['tmp_name'], "trained_data/model.weights.bin");

#mail("334558612@i.softbank.jp", "title", $body);