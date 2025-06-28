//!*script
// �t�@�C����: get_newest_filename.js
// �T�v: PPx�Ō��݊J���Ă���f�B���N�g���ɂ���A�Ō�ɕύX�܂��̓A�N�Z�X�����t�@�C������Ԃ��B
// ������: "Modify"�i�ŏI�X�V�t�@�C���j�܂��� "Access"�i�ŏI�A�N�Z�X�t�@�C���j
//
// �g�p��:
// KC_main = {
// 8    ,%J %*script("%0script\get_newest_filename.js" Modify)
// 9    ,%J %*script("%0script\get_newest_filename.js" Access)
// }

// �������Ȃ���ΏI��
if (PPx.Arguments.Length < 1) {
  PPx.Echo("����������������܂���");
  PPx.Quit();
}

var newestType = PPx.Argument(0);
if (newestType !== "Modify" && newestType !== "Access") {
  PPx.Echo('������ "Modify" �܂��� "Access" �Ŏw�肵�Ă�������');
  PPx.Quit();
}

var newestFile = null;
var newestDate = null;

// �e�G���g���𑖍�
for (var i = 0; i < PPx.Entry.Count; i++) {
  // �f�B���N�g���iAttributes & 16�j�����O
  if (!(PPx.Entry.Item(i).Attributes & 16)) {
    var date = null;
    // �w��^�C�v�ɉ����ē��t���擾
    if (newestType === "Modify") {
      date = PPx.Entry.Item(i).DateLastModified;
    } else if (newestType === "Access") {
      date = PPx.Entry.Item(i).DateLastAccessed;
    }
    // ���V�������t�Ȃ�L�^
    if (newestDate === null || date > newestDate) {
      newestFile = PPx.Entry.Item(i).Name;
      newestDate = date;
    }
  }
}

PPx.result = newestFile;
