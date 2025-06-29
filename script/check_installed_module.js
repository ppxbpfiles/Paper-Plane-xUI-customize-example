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
  //PPx�g�����W���[��
  { file: "PPxccx64.dll", name: "PPx CCX Module", path: "" },
  { file: "PPxcfx64.dll", name: "PPx CFX Module", path: "" },
  { file: "PPxetp64.dll", name: "PPx Everything Search Module", path: "" },
  { file: "PPxjunk64.dll", name: "PPx Junk Module", path: "" },
  { file: "PPxmes64.dll", name: "PPx Message Module", path: "" },
  { file: "PPxscr64.dll", name: "PPx Script Module", path: "" },
  { file: "PPxtext64.dll", name: "PPx Text Module", path: "" },
  { file: "PPxwin64.dll", name: "PPx Window Module", path: "" },
  { file: "PPxws64.dll", name: "PPx WS Module", path: "" },
  //���K�\���Emigemo���W���[��
  { file: "bregonig.dll", name: "bregonig.dll", path: "" },
  { file: "migemo.dll", name: "migemo.dll", path: "" },
  // ���k�E�𓀁E�����A�[�J�C�oDLL
  { file: "7z.dll", name: "7-zip DLL", path: "" },
  { file: "7z.exe", name: "7-zip EXE", path: "" },
  { file: "rar.exe", name: "console RAR EXE", path: "tools\\" },
  { file: "unbypass.dll", name: "UNBYPASS DLL", path: "" },
  { file: "unbypass.exe", name: "unbypass EXE", path: "" },
  { file: "7-zip64.dll", name: "7-zip64 DLL", path: "" },
  { file: "unrar64.dll", name: "UNRAR64 DLL", path: "" },
  { file: "unrar64j.dll", name: "UNRAR64J DLL", path: "" },
  { file: "unzzip64.dll", name: "UNZZIP64 DLL", path: "" },
  { file: "unlha32.dll", name: "UNLHA32 DLL", path: "" },
  { file: "cab32.dll", name: "CAB32 DLL", path: "" },
  { file: "tar64.dll", name: "TAR64 DLL", path: "" },
  //Susie�v���O�C��
  { file: "iftwic.sph", name: "iftwic.sph", path: "" },
  { file: "ifjpegt.sph", name: "ifjpegt.sph", path: "" },
  { file: "iftpsd.sph", name: "iftpsd.sph", path: "" },
  { file: "ifttf.sph", name: "ifttf.sph", path: "" },
  { file: "ifextend.sph", name: "ifextend.sph", path: "" },
  { file: "ifavif.sph", name: "ifavif.sph", path: "" },
  { file: "axtpsd.sph", name: "axtpsd.sph", path: "" },
  { file: "axttc.sph", name: "axttc.sph", path: "" },
  { file: "ifgif.sph", name: "ifgif.sph", path: "" },
  { file: "iftgdip.sph", name: "iftgdip.sph", path: "" },
  { file: "iftwebp.sph", name: "iftwebp.sph", path: "" },
  { file: "axpdf.sph", name: "axpdf.sph", path: "" },
  { file: "pdfium.dll", name: "axpdf.sph�pDLL", path: "" },
  //Susie�v���O�C���iSPI�j
  { file: "ifcrw_t.spi", name: "ifcrw_t.spi", path: "SPI\\" },
  { file: "ifdxfft.spi", name: "ifdxfft.spi", path: "SPI\\" },
  { file: "ifdwg.spi", name: "ifdwg.spi", path: "SPI\\" },
  { file: "runspi.exe", name: "runspi.exe", path: "SPI\\" },
  //���̑��O���c�[��
  { file: "busybox64u.exe", name: "busybox64", path: "" },
  { file: "ppdex64.exe", name: "PPx common dialog extender", path: "" },
  { file: "ppdex.exe", name: "PPx common dialog extender", path: "" },
  { file: "ppdex64.dll", name: "PPx common dialog extender DLL", path: "" },
  { file: "ppdex.dll", name: "PPx common dialog extender DLL", path: "" },
  { file: "xdoc2txt.exe", name: "xdoc2txt", path: "tools\\" },
  { file: "zoxide.exe", name: "zoxide", path: "tools\\" },
  { file: "es.exe", name: "everything cli", path: "tools\\" },
  { file: "exiftool.exe", name: "exiftool", path: "tools\\" },
  { file: "rg.exe", name: "ripgrep", path: "tools\\" },
  { file: "fcp.exe", name: "fastcopy cli", path: "tools\\" },
  { file: "ls2lf.exe", name: "ls2lf", path: "auxcmd\\" },
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
