/*
 * ���̓t�@�C���i��: file1.jpg�j�ƑΉ�����e�L�X�g�t�@�C���ifile1.jpg.txt �܂��� file1.txt�j�̓��e��ǂݍ��݁A
 * ���s���폜���ăC���f�b�N�X�t�@�C���ɒǋL���܂��B
 * ���̓t�@�C���ƃe�L�X�g�t�@�C���͏o�̓t�@�C���̐e�t�H���_�i��: C:\test�j�ɂ���Ɖ���B
 * ���̓t�@�C���̃p�X�͏o�̓t�@�C���̐e�t�H���_���琶���i��: file1.jpg -> C:\test\file1.jpg�j�B
 * �o�̓t�@�C���͑������Ŏw��B�t���p�X�łȂ��ꍇ�A�J�����g�f�B���N�g���ɕۑ��B
 * ���s���@:
 *   cscript //Nologo create_index_utf8.js <�t���O> <�o�̓t�@�C��> <���̓t�@�C��1> [<���̓t�@�C��2> ...]
 * ��:
 *   cscript //Nologo create_index_utf8.js output_both C:\test\00_index.txt file1.jpg file2.jpg
 *   - �o�͗�: ""file1.jpg" HelloWorld" �܂��� ""file1.jpg" [NoTextFile]" �܂��� ""file1.jpg" [NoTextContent]"
 *   cscript //Nologo create_index_utf8.js skip_empty 00_index.txt file1.jpg
 *   - �e�L�X�g�t�@�C�����Ȃ�/��̏ꍇ�A�o�͂��Ȃ��B�o�̓t�@�C���̓J�����g�f�B���N�g���ɕۑ��B
 * ����:
 *   - �������i�t���O�j: �e�L�X�g�t�@�C�������݂��Ȃ�/��̏ꍇ�̓�����w��B
 *     - "output_both": 1��ځi���̓t�@�C�����j��2��ځi[NoTextFile] �܂��� [NoTextContent]�j�̗������o�́B
 *     - "skip_empty": �e�L�X�g�t�@�C�������݂��Ȃ�/��̏ꍇ�A�o�͂��X�L�b�v�B
 *   - �������i�o�̓t�@�C���j: ���ʂ�ۑ�����t�@�C���B�t���p�X�w��A�܂��̓t�@�C�����̂݁i�J�����g�f�B���N�g���ɕۑ��j�B�t�@�C�����́u00_index�v�Ŏn�܂�A�g���q�́u.txt�v�łȂ���΂Ȃ�Ȃ��B
 *   - ��O�����ȍ~�i���̓t�@�C���j: ���̓t�@�C�����i��: file1.jpg�j�B�t���p�X�͏o�̓t�@�C���̐e�t�H���_���琶���B
 * �o��:
 *   - �w�肳�ꂽ�p�X�i�܂��̓J�����g�f�B���N�g���j�̃t�@�C���i��: C:\test\00_index.txt�j�ɍ쐬�iUTF-8�ABOM�Ȃ��j�B
 *   - �`��: ���̓t�@�C�����i���p���ň͂ށj�ƑΉ�����e�L�X�g�t�@�C���̓��e�i���s�Ȃ��j���󔒋�؂��1�s�A�e�G���g���͉��s�ŋ�؂�B
 * �e�L�X�g�t�@�C���̌���:
 *   - �o�̓t�@�C���̐e�t�H���_���݂̂Ō����i��: C:\test\file1.jpg.txt �܂��� C:\test\file1.txt�j�B
 * ����:
 *   - �X�y�[�X���܂ރt�@�C�����͈��p���ň͂�ł��������i��: "file name.jpg"�j�B
 *   - �e�L�X�g�t�@�C����UTF-8�G���R�[�f�B���O�𐄏��B
 *   - �o�̓t�@�C���̐e�t�H���_�����݂��Ȃ��ꍇ�A�G���[��\���B
 *   - ���̓t�@�C���͏o�̓t�@�C���̐e�t�H���_�ɑ��݂���K�v������܂��B
 */

// FileSystemObject��������
var fso = new ActiveXObject("Scripting.FileSystemObject");

// �t�@�C���̓��e��UTF-8�œǂݍ��݁A���s���폜����֐�
function readFileContent(filePath) {
  try {
    var stream = new ActiveXObject("ADODB.Stream");
    stream.Type = 2; // �e�L�X�g���[�h
    stream.Charset = "utf-8";
    stream.Open();
    stream.LoadFromFile(filePath);
    var content = stream.ReadText();
    stream.Close();
    // ���s���폜
    content = content
      .replace(/\r\n/g, "")
      .replace(/\n/g, "")
      .replace(/\r/g, "");
    return content;
  } catch (e) {
    WScript.Echo("�t�@�C���ǂݍ��݃G���[: " + filePath);
    return "";
  }
}

// �t�@�C�����Ɠ��e��UTF-8�iBOM�Ȃ��j�Ŏw��t�@�C���ɒǋL����֐�
function appendToOutput(outputFile, filename, content) {
  try {
    // �t�@�C�����ɉ��s���܂܂�Ă��Ȃ����`�F�b�N
    filename = filename.replace(/[\r\n]/g, "");

    var stream = new ActiveXObject("ADODB.Stream");
    stream.Type = 2;
    stream.Charset = "utf-8";
    stream.Open();

    // �V�������e�������i�t�@�C���������p���ň͂ށj
    var newLine = '"' + filename + '" ' + content + "\n";

    // �����t�@�C��������ΒǋL���[�h�ŊJ��
    if (fso.FileExists(outputFile)) {
      stream.LoadFromFile(outputFile);
      stream.Position = stream.Size; // �����Ɉړ�
    }

    stream.WriteText(newLine, 1); // 1:���s��ǉ����Ȃ�
    stream.SaveToFile(outputFile, 2); // 2:�㏑��
    stream.Close();

    // BOM���t���Ă��܂����ꍇ�͍폜
    removeBOM(outputFile);
  } catch (e) {
    WScript.Echo(
      "�o�̓t�@�C���ւ̏������݃G���[: " +
        outputFile +
        "\n" +
        (e.description || e.message)
    );
  }
}

// UTF-8 BOM���폜����֐�
function removeBOM(filePath) {
  try {
    var stream = new ActiveXObject("ADODB.Stream");
    stream.Type = 1; // �o�C�i��
    stream.Open();
    stream.LoadFromFile(filePath);
    var bytes = stream.Read();
    stream.Close();

    // BOM���o
    if (
      bytes.length >= 3 &&
      bytes.charCodeAt(0) === 0xef &&
      bytes.charCodeAt(1) === 0xbb &&
      bytes.charCodeAt(2) === 0xbf
    ) {
      // BOM���������čĕۑ�
      var stream2 = new ActiveXObject("ADODB.Stream");
      stream2.Type = 1;
      stream2.Open();
      stream2.Write(bytes.substr(3));
      stream2.SaveToFile(filePath, 2);
      stream2.Close();
    }
  } catch (e) {
    // BOM�������s�͒v���I�łȂ��̂Ŗ���
  }
}

// ���C������
try {
  var args = WScript.Arguments;
  if (args.length < 1) {
    WScript.Echo(
      "�G���[: �t���O�ioutput_both �܂��� skip_empty�j���w�肵�Ă��������B"
    );
    WScript.Quit(1);
  }
  if (args.length < 2) {
    WScript.Echo(
      "�G���[: �o�̓t�@�C���i��FC:\\test\\00_index.txt �܂��� 00_index.txt�j���w�肵�Ă��������B"
    );
    WScript.Quit(1);
  }
  if (args.length < 3) {
    WScript.Echo("�G���[: ���Ȃ��Ƃ�1�̓��̓t�@�C�����w�肵�Ă��������B");
    WScript.Quit(1);
  }

  var flag = args(0);
  // �t���O���L�����`�F�b�N
  if (flag !== "output_both" && flag !== "skip_empty") {
    WScript.Echo(
      "�G���[: �t���O�́uoutput_both�v�܂��́uskip_empty�v�łȂ���΂Ȃ�܂���: " +
        flag
    );
    WScript.Quit(1);
  }

  var outputFile = args(1);
  // �o�̓t�@�C�����t���p�X�ɕϊ��i���΃p�X�̏ꍇ�A�J�����g�f�B���N�g�����g�p�j
  outputFile = fso.GetAbsolutePathName(outputFile);

  // �o�̓t�@�C�������u00_index�v�Ŏn�܂�A�g���q��.txt���`�F�b�N
  var outputFilename = fso.GetFileName(outputFile);
  if (!outputFilename.match(/^00_index.*\.txt$/i)) {
    WScript.Echo(
      "�G���[: �o�̓t�@�C�����́u00_index�v�Ŏn�܂�A\n�g���q���u.txt�v�łȂ���΂Ȃ�܂���i��: 00_index_something.txt�j: " +
        outputFilename
    );
    WScript.Quit(1);
  }
  if (
    outputFilename === "" ||
    outputFilename.match(/[\\\/:*?"<>|]/) ||
    outputFilename.match(/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i)
  ) {
    WScript.Echo("�G���[: �����ȏo�̓t�@�C�����ł�: " + outputFilename);
    WScript.Quit(1);
  }

  // �o�̓t�@�C���̐e�t�H���_�����݂��邩�`�F�b�N
  var outputDir = fso.GetParentFolderName(outputFile);
  if (!fso.FolderExists(outputDir)) {
    WScript.Echo(
      "�G���[: �o�̓t�@�C���̐e�t�H���_�����݂��܂���: " + outputDir
    );
    WScript.Quit(1);
  }

  // �e���̓t�@�C���i��O�����ȍ~�j������
  for (var i = 2; i < args.length; i++) {
    // ���̓t�@�C�����i��: file1.jpg�j
    var shortFilename = args(i);
    // ���̓t�@�C���̃t���p�X�𐶐��i�o�̓t�@�C���̐e�t�H���_���g�p�j
    var filePath = outputDir + "\\" + shortFilename;

    if (!fso.FileExists(filePath)) {
      WScript.Echo("�x��: �t�@�C�������݂��܂���: " + filePath);
      continue;
    }

    // �Ή�����e�L�X�g�t�@�C����������i�o�̓t�@�C���̐e�t�H���_���̂݌����j
    var txtPath1 = filePath + ".txt"; // file1.jpg.txt
    var txtPath2 = outputDir + "\\" + fso.GetBaseName(filePath) + ".txt"; // file1.txt

    var content = "";
    if (fso.FileExists(txtPath1)) {
      content = readFileContent(txtPath1);
      if (content === "") {
        content = "[NoTextContent]"; // �e�L�X�g�t�@�C���̓��e����̏ꍇ
      }
    } else if (fso.FileExists(txtPath2)) {
      content = readFileContent(txtPath2);
      if (content === "") {
        content = "[NoTextContent]"; // �e�L�X�g�t�@�C���̓��e����̏ꍇ
      }
    } else {
      content = "[NoTextFile]"; // �e�L�X�g�t�@�C�����Ȃ��ꍇ
    }

    // �t���O�Ɋ�Â��ďo�͂��邩�ǂ���������
    if (
      flag === "skip_empty" &&
      (content === "[NoTextFile]" || content === "[NoTextContent]")
    ) {
      continue; // �e�L�X�g�t�@�C�����Ȃ�/��̏ꍇ�A�X�L�b�v
    }

    // �o�̓t�@�C���ɒǋL
    appendToOutput(outputFile, shortFilename, content);
  }
} catch (e) {
  WScript.Echo("�G���[: " + (e.description || e.message));
  WScript.Quit(1);
}
