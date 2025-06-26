//!*script
// PPx�g�����W���[���̃C���X�g�[���`�F�b�N
// ���s�f�B���N�g���i%0�j����� %0\tools\ ���̕K�v���W���[���̑��݂��m�F���܂��B
// �E�ʏ���s: *script "%0script\check_installed_module.js"
//   - _user:checkmodule=1 �̏ꍇ�A���W���[�����@���Ƀ_�C�A���O�\��
//   - _user:checkmodule=0 �̏ꍇ�A�_�C�A���O���X�L�b�v
// �E�����\��: *script "%0script\check_installed_module.js" force
//   - _user:checkmodule �̒l�Ɋ֌W�Ȃ��G���[���b�Z�[�W��\��

// _user:checkmodule �����ݒ�Ȃ� 1 ���Z�b�g
if (PPx.Extract('%su"checkmodule"') === "") {
  PPx.Execute("*setcust _user:checkmodule=1");
}

// "force"�w�莞�͏�Ƀ_�C�A���O�\��
var forceMode = PPx.Arguments.length > 0 && PPx.Argument(0) === "force";

// _user:checkmodule=0 ���� force�łȂ���΃`�F�b�N���X�L�b�v
if (!forceMode && PPx.Extract('%su"checkmodule"') === "0") {
  PPx.Quit(1);
}

// �t�@�C���V�X�e������p�I�u�W�F�N�g
var fs = PPx.CreateObject("Scripting.FileSystemObject");

// ���s�f�B���N�g���擾
var basePath = PPx.Extract("%0");

// �`�F�b�N�Ώۃ��W���[�����X�g
var modules = [
  { file: "ppxcfx64.dll", name: "PPx CFX Module", path: "" },
  { file: "ppxmes64.dll", name: "PPx Message Module", path: "" },
  { file: "ppxtext64.dll", name: "PPx Text Module", path: "" },
  { file: "ppxwin64.dll", name: "PPx Window Module", path: "" },
  { file: "ppxjunk64.dll", name: "PPx Junk Module", path: "" },
  { file: "ppxetp64.dll", name: "PPx Everything Search Module", path: "" },
  { file: "ppxccx64.dll", name: "PPx CCX Module", path: "" },
  { file: "xdoc2txt.exe", name: "xdoc2txt", path: "tools\\" },
];

// ���@���W���[���̃G���[���b�Z�[�W���W
var errorMessages = [];
for (var i = 0; i < modules.length; i++) {
  var m = modules[i];
  var fullPath = basePath + m.path + m.file;
  // �t�@�C�������݂��Ȃ��ꍇ�̂݃G���[�ɒǉ�
  if (!fs.FileExists(fullPath)) {
    errorMessages.push(
      m.name + "�i%0" + m.path + m.file + "�j���C���X�g�[������Ă��܂���B"
    );
  }
}

// ���@���Ȃ���ΏI��
if (errorMessages.length === 0) {
  PPx.Quit(1);
}

// �G���[���b�Z�[�W�쐬
var message = errorMessages.join("\r\n");
if (!forceMode) {
  message +=
    "\r\n�Ȍケ�̃��b�Z�[�W��\�����Ȃ��i�ĕ\���� _user:checkmodule=1 �ɐݒ�j";
}

// �_�C�A���O�\���i�u�͂��v=�ȍ~��\���A�u�������v=������\���j
var result = PPx.Extract(
  '%*choice(-title:"check_installed_module.js" -type:yn -text"' + message + '")'
);
if (!forceMode && result === "1") {
  PPx.Execute("*setcust _user:checkmodule=0");
}

// �X�N���v�g�I��
