const edit = document.querySelector('form')

// 「全てチェック」変更時の処理
for (let input of document.querySelectorAll('input[name=\'allCheck\']')) {
  input.addEventListener('change', function(){
    let labels = null
    // ラベルの場合
    if (this.value === 'label') {
      labels = document.querySelectorAll('input[name=\'label[]\']')
    // ファイルの場合
    } else {
      labels = this.parentNode.parentNode.querySelectorAll('.checked > input')
    }
    for (let label of labels) {
      label.checked = this.checked
    }
  })
}

edit.addEventListener('submit', function(){
  let arr = []
  for (let input of document.querySelectorAll('.checked > input')) {
    // 確認済みチェックボックスがページロード時から変更されている場合
    if (input.checked && input.dataset.checked === '' ||
        !input.checked && input.dataset.checked === 'checked') {
      arr.push(input.value)
    }
  }
  if (arr.length) {
    const hiddenInput = document.createElement('input')
    hiddenInput.type = 'hidden'
    hiddenInput.name = 'changeChecked'
    hiddenInput.value = arr.join(',')
    edit.appendChild(hiddenInput)      
  }
  for (let input of document.querySelectorAll('.change > input')) {
    if (input.value === '') {
      input.parentNode.removeChild(input)
    }
  }
})

for (let button of document.querySelectorAll('button')) {
  button.addEventListener('click', function(){
    if (this.name === 'search')
      edit.action = './index.php'
    else {
      console.log('教師データを作成中')
      event.preventDefault()
      event.stopPropagation()
      // 教師データを作成させる
      // $.ajax({
      //   type: 'POST',
      //   url: 'http://have-a-go.moo.jp/handwriting_2/create_train_data.php',
      // }).then(
      //   function(response){
      //     console.log(response)
      //     alert('作成に成功しました。')
      //   },
      //   function(response){
      //     console.log(response)
      //     alert('作成に失敗しました。')
      //   }
      // )
    }
  })
}

for (let div of document.querySelectorAll('.file > div')) {
  div.addEventListener('click', function(){
    const img = this.querySelector('img')
    if (img.style.zIndex === '-1') {
      img.style.zIndex = 1
    } else {
      img.style.zIndex = -1
    }
  })
}

for (let label of document.querySelectorAll('.change')) {
  label.addEventListener('click', function(){
    if (event.target.tagName === 'LABEL') {
      this.firstChild.style.display = 'inline'
    }
  })

  label.firstChild.addEventListener('blur', function(){
    if (this.value === '') {
      this.style.display = 'none'
    }
  })
}
