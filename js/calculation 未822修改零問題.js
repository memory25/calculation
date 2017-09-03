/*
減法除法沒有交換、結合律,先乘除後加減,括號得先做
取得一個陣列-S-之後，
先搜尋陣列中 左括號  跟  右括號 之間的陣列-A-
先對-A-陣列做完所有 除法運算 做完後更新-A-陣列
再對-A-陣列做完所有 乘法運算 做完後更新-A-陣列
再對-A-陣列做完所有 減法運算 做完後更新-A-陣列
剩下-A-陣列做完所有 加法運算 做完後更新-A-陣列
==> 最後-A-陣列只剩一個存著一個數字的元素
更新-S-陣列  左括號跟右括號中的元素 替換成陣列-A-
重複以上直到-S-陣列只剩一個存著一個數字的元素
*/

/*---簡單四則運算---*/
var _numrate = 10000000000000000000;

function add(numA, numB) {
    return (parseFloat(numA) * _numrate + parseFloat(numB) * _numrate) / _numrate;
}

function sub(numA, numB) {
    return (numA * _numrate - numB * _numrate) / _numrate;
}

function mul(numA, numB) {
    return (numA * _numrate) * (numB * _numrate) / _numrate / _numrate;
}

function div(numA, numB) {
    return (numA * _numrate) / (numB * _numrate);
}
/*---簡單四則運算---*/


/*先把所有的乘法運算做完 做完後原陣列改變*/
function divFirst(arr) {
    var temp = new Array(),
        i;
    for (i = arr.length; i > 0; i--) {
        if (arr[i] == "÷") { /*先由陣列右方往左邊搜尋  之後pop出來的是由左往右*/
            temp.push(i)
        } /*搜尋陣列中有 除 符號的索引值 並存起來*/
    }
    var len = temp.length;
    for (i = 0; i < len; i++) {
        var tempIndex = temp.pop();
        if (i >= 1) {
            tempIndex = tempIndex - 2 * i; /*每次做完 陣列長度會少 3個 然後補上1個 所以是少2個長度*/
        }
        arr.splice(tempIndex - 1, 3, div(arr[tempIndex - 1], arr[tempIndex + 1]));
    } /*改變全域的arr  去掉3個 補上1個*/
}

function mulSec(arr) {
    var temp = new Array(),
        i;
    for (i = 0; i < arr.length; i++) {
        if (arr[i] == "x") {
            temp.push(i)
        }
    } /*搜尋陣列中有 乘 符號的索引值 並存起來*/
    var len = temp.length;
    for (i = 0; i < len; i++) {
        var tempIndex = temp.pop()
        arr.splice(tempIndex - 1, 3, mul(arr[tempIndex - 1], arr[tempIndex + 1]))
    } /*改變全域的arr  去掉3個 補上1個*/
}

function subThree(arr) {
    var temp = new Array(),
        i;
    for (i = arr.length; i > 0; i--) {
        if (arr[i] == "-") {
            temp.push(i)
        }
    }
    var len = temp.length
    for (i = 0; i < len; i++) {
        var tempIndex = temp.pop()
        if (i >= 1) {
            tempIndex = tempIndex - 2 * i; /*每次做完 陣列長度會少 3個 然後補上1個 所以是少2個長度*/
        }
        arr.splice(tempIndex - 1, 3, sub(arr[tempIndex - 1], arr[tempIndex + 1]))
    }
}


function addFour(arr) {
    var temp = new Array(),
        i;
    for (i = 0; i < arr.length; i++) {
        if (arr[i] == "+") {
            temp.push(i)
        }
    }
    var len = temp.length
    for (i = 0; i < len; i++) {
        var tempIndex = temp.pop()
        arr.splice(tempIndex - 1, 3, add(arr[tempIndex - 1], arr[tempIndex + 1]))
    }
}
/*先把所有的乘法運算做完 做完後原陣列改變*/


/*只要找到左括號 就push進去 
之後第一個pop出來的 就是最右邊的左括號
也就是首輪先要做的括號
取出括號後
依序執行 div mul sub add四種方法
*/
function calNum(arr) {
    var temp = new Array(),
        arrTemp = new Array(),
        i;
    /*temp陣列 儲存 找到的 左括號之索引值用
    arrTemp陣列 用來複製一份傳入的陣列*/
    if (arr.length > 1) {
        for (i = 0; i < arr.length; i++) {
            arrTemp[i] = arr[i];
        }

        /*搜索看看有沒有左括號*/
        for (i = 0; i < arrTemp.length; i++) {
            if (arrTemp[i] == "(") {
                temp.push(i);
            }
            if (arrTemp[i] == ")" && temp.length == 0) {
                /*當左括號 索引值 小於右括號時*/
                return "括號不成對 少了左括號";
            }

        }
    }

    if (temp.length > 0) {
        /*假如沒有括號 就不會執行以下迴圈*/
        var leftBracketsIndex = temp.pop();
        /*僅需要最右邊的左括號*/


        for (i = leftBracketsIndex; i < arrTemp.length; i++) {
            /*從左括號的索引開始往右找 ( */

            if (arrTemp[i] == ")") {
                arrTemp.splice(i, arrTemp.length - i);
                arrTemp.splice(0, parseFloat(leftBracketsIndex) + 1);
                /*先刪除陣列的 i到最後   再刪除 0到左括號*/



                divFirst(arrTemp);
                mulSec(arrTemp);
                subThree(arrTemp);
                addFour(arrTemp);
                /*依序做 除法 乘法 減法 加法 運算之後
                把原始陣列 括號內的元素清掉  並且補上括號內運算完的結果
                */
                if (arrTemp.length == 0) {
                    /*   假如遇到 ()連在一起  直接刪除兩個元素  */
                    arr.splice(parseFloat(leftBracketsIndex), i - parseFloat(leftBracketsIndex) + 1);
                } else {
                    arr.splice(parseFloat(leftBracketsIndex), i - parseFloat(leftBracketsIndex) + 1, arrTemp);
                }



                return calNum(arr);
            } else if (i == arrTemp.length - 1) {
                /*假如 ) 搜不到  且i是最後一個了 不用加 && 因為if沒找到後才會跳到第二個if*/
                return "括號不成對 少了右括號";
            }
        }
    } else {
        divFirst(arr);
        mulSec(arr);
        subThree(arr);
        addFour(arr);

        return arr;
    }

}
/*----------陣列中各元素計算到只剩最後一個元素-------*/

var arr = ["1", "-", "(", "-2", "+", "53", "x", "-10", "÷", "5", "-", "5", ")", "+", "2"];
//alert(calNum(arr))

var test = ["(", "5", "+", "2", ")"];
//alert(calNum(test));



/*--↓↓↓↓↓↓--點擊按鍵輸入紀錄效果---↓↓↓↓↓↓--*/
function btnClickInput() {
    var _showMain = "",
        recordShow = "",
        _calArray = new Array();

    /*滑鼠點擊版*/
    document.getElementById("btn0").onclick = function() {
        if (_showMain[0] != 0) {
            /*避免開頭連按0*/
            if (_calArray.length == 1 && _calArray[0] != "(") {
                /*按了等於 得到數字之後 如果下一個案的是數字
                前面的紀錄清空  如果不是數字 就繼續運算
                */
                _calArray = [];
                document.getElementById("recordShow").innerHTML = _calArray;
            }
            _showMain += "0";
            document.getElementById("showMain").innerHTML = _showMain;
        }
    }
    document.getElementById("btn1").onclick = function() {
        if (_calArray.length == 1 && _calArray[0] != "(") {
            _calArray = [];
            document.getElementById("recordShow").innerHTML = _calArray;
        }
        if (_showMain[0] == "0" && _showMain[1] != ".") {
            /*假如先按了 0  並且後面沒有小數點
            之後按了其他數字 刪除0
            */
            _showMain = "";
        }
        _showMain += "1";
        document.getElementById("showMain").innerHTML = _showMain;
    }
    document.getElementById("btn2").onclick = function() {
        if (_calArray.length == 1 && _calArray[0] != "(") {
            _calArray = [];
            document.getElementById("recordShow").innerHTML = _calArray;
        }
        if (_showMain[0] == "0" && _showMain[1] != ".") {
            _showMain = "";
        }
        _showMain += "2";
        document.getElementById("showMain").innerHTML = _showMain;
    }

    document.getElementById("btn3").onclick = function() {
        if (_calArray.length == 1 && _calArray[0] != "(") {
            _calArray = [];
            document.getElementById("recordShow").innerHTML = _calArray;
        }
        if (_showMain[0] == "0" && _showMain[1] != ".") {
            _showMain = "";
        }
        _showMain += "3";
        document.getElementById("showMain").innerHTML = _showMain;
    }

    document.getElementById("btn4").onclick = function() {
        if (_calArray.length == 1 && _calArray[0] != "(") {
            _calArray = [];
            document.getElementById("recordShow").innerHTML = _calArray;
        }
        if (_showMain[0] == "0" && _showMain[1] != ".") {
            _showMain = "";
        }
        _showMain += "4";
        document.getElementById("showMain").innerHTML = _showMain;
    }
    document.getElementById("btn5").onclick = function() {
        if (_calArray.length == 1 && _calArray[0] != "(") {
            _calArray = [];
            document.getElementById("recordShow").innerHTML = _calArray;
        }
        if (_showMain[0] == "0" && _showMain[1] != ".") {
            _showMain = "";
        }
        _showMain += "5";
        document.getElementById("showMain").innerHTML = _showMain;
    }
    document.getElementById("btn6").onclick = function() {
        if (_calArray.length == 1 && _calArray[0] != "(") {
            _calArray = [];
            document.getElementById("recordShow").innerHTML = _calArray;
        }
        if (_showMain[0] == "0" && _showMain[1] != ".") {
            _showMain = "";
        }
        _showMain += "6";
        document.getElementById("showMain").innerHTML = _showMain;
    }
    document.getElementById("btn7").onclick = function() {
        if (_calArray.length == 1 && _calArray[0] != "(") {
            _calArray = [];
            document.getElementById("recordShow").innerHTML = _calArray;
        }
        if (_showMain[0] == "0" && _showMain[1] != ".") {
            _showMain = "";
        }
        _showMain += "7";
        document.getElementById("showMain").innerHTML = _showMain;
    }
    document.getElementById("btn8").onclick = function() {
        if (_calArray.length == 1 && _calArray[0] != "(") {
            _calArray = [];
            document.getElementById("recordShow").innerHTML = _calArray;
        }
        if (_showMain[0] == "0" && _showMain[1] != ".") {
            _showMain = "";
        }
        _showMain += "8";
        document.getElementById("showMain").innerHTML = _showMain;
    }
    document.getElementById("btn9").onclick = function() {
        if (_calArray.length == 1 && _calArray[0] != "(") {
            _calArray = [];
            document.getElementById("recordShow").innerHTML = _calArray;
        }
        if (_showMain[0] == "0" && _showMain[1] != ".") {
            _showMain = "";
        }
        _showMain += "9";
        document.getElementById("showMain").innerHTML = _showMain;
    }


    /*---↓↓↓↓↓↓---加減乘除括號 按鍵額外處裡----↓↓↓↓↓↓--*/
    /*按完 加減乘除 任一運算符號後
 calArray紀錄用陣列  showMain的字串push進去
 然後清空showMain 在push一個 加減乘除的符號
  */
    document.getElementById("btn+").onclick = function() {
        /*假如判斷到前一個也是 + 不做任何事情 避免連續按
        假如前面是其他符號 那就 刪除原本的那個符號 補上一個 + 
        */
        if (_calArray.length == 0 && _showMain == "") {
            /*陣列紀錄為空  先輸入的字串為空 什麼都不做*/
        } else if ((_calArray[_calArray.length - 1] == "+" || _calArray[_calArray.length - 1] == "-" || _calArray[_calArray.length - 1] == "x" || _calArray[_calArray.length - 1] == "÷") && _showMain == "") {
            /*陣列最後一個元素為 符號  先前輸入字串為空 代表連續按運算符號
            pop出前一個元素，在push一個加號進去  成功做運算符號替;
            */
            _calArray.pop();
            _showMain = "+";
            _calArray.push(_showMain);
        } else if (_showMain != "") {
            _calArray.push(_showMain);
            _showMain = "+";
            _calArray.push(_showMain);
        } else if (_calArray[_calArray.length - 1] == ")" || (_calArray.length == 1 && (_calArray[0] != "(" && _calArray[0] != ")"))) {
            /*右括號後直接push+號
            左括號後面不可以接運算符號
            */
            _showMain = "+";
            _calArray.push(_showMain);
        }
        _showMain = "";
        document.getElementById("recordShow").innerHTML = _calArray.join(" ");
        document.getElementById("showMain").innerHTML = "　";
        //把calArray的東西變成字串 並去掉逗點 輸出到紀錄區給使用者看
    }

    document.getElementById("btn-").onclick = function() {
        if (_calArray.length == 0 && _showMain == "") {
            /*陣列紀錄為空  先輸入的字串為空 什麼都不做*/
        } else if ((_calArray[_calArray.length - 1] == "+" || _calArray[_calArray.length - 1] == "-" || _calArray[_calArray.length - 1] == "x" || _calArray[_calArray.length - 1] == "÷") && _showMain == "") {
            /*陣列最後一個元素為 符號  先前輸入字串為空 代表連續按運算符號
            pop出前一個元素，在push一個加號進去  成功做運算符號替;
            */
            _calArray.pop();
            _showMain = "-";
            _calArray.push(_showMain);
        } else if (_showMain != "") {
            _calArray.push(_showMain);
            _showMain = "-";
            _calArray.push(_showMain);
        } else if (_calArray[_calArray.length - 1] == ")" || (_calArray.length == 1 && (_calArray[0] != "(" && _calArray[0] != ")"))) {
            _showMain = "-";
            _calArray.push(_showMain);
        }
        _showMain = "";
        document.getElementById("recordShow").innerHTML = _calArray.join(" ");
        document.getElementById("showMain").innerHTML = "　";
    }
    document.getElementById("btnx").onclick = function() {
        if (_calArray.length == 0 && _showMain == "") {
            /*陣列紀錄為空  先輸入的字串為空 什麼都不做*/
        } else if ((_calArray[_calArray.length - 1] == "+" || _calArray[_calArray.length - 1] == "-" || _calArray[_calArray.length - 1] == "x" || _calArray[_calArray.length - 1] == "÷") && _showMain == "") {
            /*陣列最後一個元素為 符號  先前輸入字串為空 代表連續按運算符號
            pop出前一個元素，在push一個加號進去  成功做運算符號替;
            */
            _calArray.pop();
            _showMain = "x";
            _calArray.push(_showMain);
        } else if (_showMain != "") {
            _calArray.push(_showMain);
            _showMain = "x";
            _calArray.push(_showMain);
        } else if (_calArray[_calArray.length - 1] == ")" || (_calArray.length == 1 && (_calArray[0] != "(" && _calArray[0] != ")"))) {
            _showMain = "x";
            _calArray.push(_showMain);
        }
        _showMain = "";
        document.getElementById("recordShow").innerHTML = _calArray.join(" ");
        document.getElementById("showMain").innerHTML = "　";
    }
    document.getElementById("btn/").onclick = function() {
        if (_calArray.length == 0 && _showMain == "") {
            /*陣列紀錄為空  先輸入的字串為空 什麼都不做*/
        } else if ((_calArray[_calArray.length - 1] == "+" || _calArray[_calArray.length - 1] == "-" || _calArray[_calArray.length - 1] == "x" || _calArray[_calArray.length - 1] == "÷") && _showMain == "") {
            /*陣列最後一個元素為 符號  先前輸入字串為空 代表連續按運算符號
            pop出前一個元素，在push一個加號進去  成功做運算符號替;
            */
            _calArray.pop();
            _showMain = "÷";
            _calArray.push(_showMain);
        } else if (_showMain != "") {
            _calArray.push(_showMain);
            _showMain = "÷";
            _calArray.push(_showMain);
        } else if (_calArray[_calArray.length - 1] == ")" || (_calArray.length == 1 && (_calArray[0] != "(" && _calArray[0] != ")"))) {
            _showMain = "÷";
            _calArray.push(_showMain);
        }
        _showMain = "";
        document.getElementById("recordShow").innerHTML = _calArray.join(" ");
        document.getElementById("showMain").innerHTML = "　";
    }

    document.getElementById("btn(").onclick = function() {
        if (_calArray[_calArray.length - 1] == "+" || _calArray[_calArray.length - 1] == "-" || _calArray[_calArray.length - 1] == "x" || _calArray[_calArray.length - 1] == "÷" || _calArray[_calArray.length - 1] == "(") {
            _showMain = "(";
            _calArray.push(_showMain);
            _showMain = "";
            document.getElementById("recordShow").innerHTML = _calArray.join(" ");
            document.getElementById("showMain").innerHTML = "　";
        } else if (_calArray.length == 0) {
            _showMain = "(";
            _calArray.push(_showMain);
            _showMain = "";
            document.getElementById("recordShow").innerHTML = _calArray.join(" ");
            document.getElementById("showMain").innerHTML = "　";
        }
    }
    document.getElementById("btn)").onclick = function() {
        if (_showMain != 0) {
            _calArray.push(_showMain);
        }
        if (_calArray[_calArray.length - 1] != "+" && _calArray[_calArray.length - 1] != "-" && _calArray[_calArray.length - 1] != "x" && _calArray[_calArray.length - 1] != "÷" && _calArray[_calArray.length - 1] != "(") {
            _showMain = ")";
            _calArray.push(_showMain);
            _showMain = "";
            document.getElementById("recordShow").innerHTML = _calArray.join(" ");
            document.getElementById("showMain").innerHTML = "　";
        }
    }
    /*-----↑↑↑↑↑↑↑---加減乘除括號 按鍵額外處裡--↑↑↑↑↑↑↑---*/
    /*點*/
    document.getElementById("btn.").onclick = function() {
        /*避免連. 1.2.34.5 */
        var temp = false,
            i;
        if (_showMain != "") {
            for (i = 0; i < _showMain.length; i++) {
                if (_showMain[i] == ".") {
                    temp = true;
                }
            }
            if (!temp) {
                _showMain += ".";
                document.getElementById("showMain").innerHTML = _showMain;
            }
        }
    }
    /*清空*/
    document.getElementById("btnC").onclick = function() {
        _showMain = "";
        _calArray = [];
        document.getElementById("showMain").innerHTML = 0;
        document.getElementById("recordShow").innerHTML = "";
    }
    /*加上正負號*/
    document.getElementById("btn±").onclick = function() {
        if (_showMain[0] == "-") {
            _showMain = _showMain.substring(1, _showMain.length);
            document.getElementById("showMain").innerHTML = _showMain;
        } else {
            _showMain = "-" + _showMain.substring(0, _showMain.length);
            document.getElementById("showMain").innerHTML = _showMain;
        }
    }
    /*刪除號*/
    document.getElementById("btndel").onclick = function() {
        _showMain = _showMain.substring(0, _showMain.length - 1);
        document.getElementById("showMain").innerHTML = _showMain;
    }
    /*等號*/
    document.getElementById("btn=").onclick = function() {
        if (_showMain.length == 0 && _calArray[_calArray.length - 1] != ")") {
            //加減乘除符號後面不可按等於
        } else if (_showMain.length == 0 && _calArray[_calArray.length - 1] == ")") {
            document.getElementById("recordShow").innerHTML = _calArray.join(" ")　 + " =";
            document.getElementById("showMain").innerHTML = calNum(_calArray);
            _showMain = "";
        } else if (_calArray[_calArray.length - 1] == "+" || _calArray[_calArray.length - 1] == "-" || _calArray[_calArray.length - 1] == "x" || _calArray[_calArray.length - 1] == "÷") {
            _calArray.push(_showMain);
            document.getElementById("recordShow").innerHTML = _calArray.join(" ")　 + " =";
            document.getElementById("showMain").innerHTML = calNum(_calArray);
            _showMain = "";
            //document.getElementById("tt").innerHTML = "calArray = "+_calArray + "  showMain = " +_showMain;
            //測試calArray陣列 跟輸入屏用
        }
    }


    /*--------------鍵盤版------------------------*/
    /*數字1~9函數*/
    function keyboardInputNum(e, keycode) {
        if (e.which == keycode || e.keyCode == keycode) {
            if (_showMain[0] == "0" && _showMain[1] != ".") {
                _showMain = "";
            }
            if (_calArray.length == 1 && _calArray[0] != "(") {
                _calArray = [];
                document.getElementById("recordShow").innerHTML = _calArray;
            }
            _showMain += "" + (keycode - 96);
            document.getElementById("showMain").innerHTML = _showMain;
        }
    }
    /*運算符號+-x÷*/
    function keyboardInputOperate(e, keycode, operate) {
        if (e.which == keycode || e.keyCode == keycode) {

            /*假如判斷到前一個也是 + 不做任何事情 避免連續按
            假如前面是其他符號 那就 刪除原本的那個符號 補上一個 + 
            */
            if (_calArray.length == 0 && _showMain == "") {
                /*陣列紀錄為空  先輸入的字串為空 什麼都不做*/
            } else if ((_calArray[_calArray.length - 1] == "+" || _calArray[_calArray.length - 1] == "-" || _calArray[_calArray.length - 1] == "x" || _calArray[_calArray.length - 1] == "÷") && _showMain == "") {
                /*陣列最後一個元素為 符號  先前輸入字串為空 代表連續按運算符號
                pop出前一個元素，在push一個加號進去  成功做運算符號替;
                */
                _calArray.pop();
                _showMain = operate; /*傳入的運算符號*/
                _calArray.push(_showMain);
            } else if (_showMain != "") {
                _calArray.push(_showMain);
                _showMain = operate;
                _calArray.push(_showMain);
            } else if (_calArray[_calArray.length - 1] == ")" || (_calArray.length == 1 && (_calArray[0] != "(" || _calArray[0] != ")"))) {
                _showMain = operate;
                _calArray.push(_showMain);
            }
            _showMain = "";
            document.getElementById("recordShow").innerHTML = _calArray.join(" ");
            document.getElementById("showMain").innerHTML = "　";
            //把calArray的東西變成字串 並去掉逗點 輸出到紀錄區給使用者看
        }
    }


    document.onkeydown = function(e) {
        var i;
        if ((e.which == 96 || e.keyCode == 96) && _showMain[0] != 0) {
            if (_calArray.length == 1 && _calArray[0] != "(") {
                _calArray = [];
                document.getElementById("recordShow").innerHTML = _calArray;
            }
            _showMain += "0";
            document.getElementById("showMain").innerHTML = _showMain;
        }
        /*鍵盤鍵入1~9*/
        for (i = 97; i <= 105; i++) {
            keyboardInputNum(e, i)
        }
        /*鍵盤鍵入加減乘除*/
        keyboardInputOperate(e, 106, "x");
        keyboardInputOperate(e, 107, "+");
        keyboardInputOperate(e, 109, "-");
        keyboardInputOperate(e, 111, "÷");

        /*---------鍵盤鍵入 左右括號------------*/
        if (e.which == 57 || e.keyCode == 57) {
            if (_calArray[_calArray.length - 1] == "+" || _calArray[_calArray.length - 1] == "-" || _calArray[_calArray.length - 1] == "x" || _calArray[_calArray.length - 1] == "÷" || _calArray[_calArray.length - 1] == "(") {
                _showMain = "(";
                _calArray.push(_showMain);
                _showMain = "";
                document.getElementById("recordShow").innerHTML = _calArray.join(" ");
                document.getElementById("showMain").innerHTML = "　";
            } else if (_calArray.length == 0) {
                _showMain = "(";
                _calArray.push(_showMain);
                _showMain = "";
                document.getElementById("recordShow").innerHTML = _calArray.join(" ");
                document.getElementById("showMain").innerHTML = "　";
            }
        }

        if (e.which == 48 || e.keyCode == 48) {
            if (_showMain != 0) {
                _calArray.push(_showMain);
            }
            if (_calArray[_calArray.length - 1] != "+" && _calArray[_calArray.length - 1] != "-" && _calArray[_calArray.length - 1] != "x" && _calArray[_calArray.length - 1] != "÷" && _calArray[_calArray.length - 1] != "(") {
                _showMain = ")";
                _calArray.push(_showMain);
                _showMain = "";
                document.getElementById("recordShow").innerHTML = _calArray.join(" ");
                document.getElementById("showMain").innerHTML = "　";
            }
        }
        /*---------鍵盤鍵入 左右括號------------*/

        /*-------鍵盤按下 右下enter 輸入 = */
        if (e.keyCode == 13 || e.which == 13) {
            /*右下方enter 等價於 輸入 =*/
            e.preventDefault(); /*移除原本預設的功能*/
            if (_showMain.length == 0 && _calArray[_calArray.length - 1] != ")") {
                //加減乘除符號後面不可按等於
            } else if (_showMain.length == 0 && _calArray[_calArray.length - 1] == ")") {
                document.getElementById("recordShow").innerHTML = _calArray.join(" ")　 + " =";
                document.getElementById("showMain").innerHTML = calNum(_calArray);
                _showMain = "";
            } else if (_calArray[_calArray.length - 1] == "+" || _calArray[_calArray.length - 1] == "-" || _calArray[_calArray.length - 1] == "x" || _calArray[_calArray.length - 1] == "÷") {
                _calArray.push(_showMain);
                document.getElementById("recordShow").innerHTML = _calArray.join(" ")　 + " =";
                document.getElementById("showMain").innerHTML = calNum(_calArray);
                _showMain = "";
                //document.getElementById("tt").innerHTML = "calArray = "+_calArray + "  showMain = " +_showMain;
                //測試calArray陣列 跟輸入屏用
            }
        }
        /*-------鍵盤按下 右下enter 輸入 = */

        /*backspace 刪除上一個字用*/
        if (e.keyCode == 8 || e.which == 8) {
            e.preventDefault();
            _showMain = _showMain.substring(0, _showMain.length - 1);
            document.getElementById("showMain").innerHTML = _showMain;
        }
        /*backspace 刪除上一個字用*/

        /*   小數點   */
        if (e.keyCode == 110 || e.which == 110) {
            var temp = false,
                i;
            if (_showMain != "") {
                for (i = 0; i < _showMain.length; i++) {
                    if (_showMain[i] == ".") {
                        temp = true;
                    }
                }
                if (!temp) {
                    _showMain += ".";
                    document.getElementById("showMain").innerHTML = _showMain;
                }
            }
        }
        /*   小數點   */

    } //document.onkeydown = function

} //btnClickInput()


btnClickInput();
/*--↑↑↑↑↑--點擊按鍵輸入紀錄效果---↑↑↑↑↑--*/