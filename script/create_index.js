/*
 * �e�L�X�g�t�@�C����ǂݍ��݁A���e������s���폜���ăC���f�b�N�X�t�@�C���ɒǋL���܂��B
 * ���s���@:
 *   cscript //Nologo create_index.js <�o�̓t�@�C��> <���̓t�@�C��1> [<���̓t�@�C��2> ...]
 * ��:
 *   cscript //Nologo create_index.js 00_index.txt C:\test\file1.txt
 *   - �o�͂� "file1.txt HelloWorld"
 * ����:
 *   - �o�̓t�@�C��: ���ʂ�ۑ�����t�@�C�����i��F00_index.txt�j�B
 *   - ���̓t�@�C��: ��������e�L�X�g�t�@�C���iUTF-8�����j�B
 * �o��:
 *   - �ŏ��̓��̓t�@�C���̐e�t�H���_��<�o�̓t�@�C��>���쐬�iUTF-8�ABOM�Ȃ��j�B
 *   - �`��: ���̓t�@�C�����Ɠ��e�i���s�Ȃ��j���󔒋�؂��1�s�A�e�G���g���͉��s�ŋ�؂�B
 * �G���[:
 *   - �������s�������ꍇ��t�@�C�������݂��Ȃ��ꍇ�ɃG���[���b�Z�[�W��\���B
 * ����:
 *   - �X�y�[�X���܂ރt�@�C���p�X�͈��p���ň͂�ł��������i��F"C:\test\file name.txt"�j�B
 *   - ���̓t�@�C����UTF-8�G���R�[�f�B���O�𐄏��B
 */

// FileSystemObject��������
var fso = new ActiveXObject("Scripting.FileSystemObject"); // �t�@�C������p�I�u�W�F�N�g

// �t�@�C���̓��e��UTF-8�œǂݍ��݁A���s���폜����֐�
function readFileContent(filePath) {
    try {
        // ADODB.Stream���g�p����UTF-8�œǂݍ���
        var stream = new ActiveXObject("ADODB.Stream");
        stream.Type = 2; // �e�L�X�g���[�h
        stream.Charset = "utf-8"; // UTF-8�G���R�[�f�B���O
        stream.Open();
        stream.LoadFromFile(filePath); // �t�@�C���ǂݍ���
        var content = stream.ReadText(); // �S���e���擾
        stream.Close(); // �X�g���[�������
        // ���s�iCRLF, LF, CR�j���폜
        content = content.replace(/\r\n/g, "").replace(/\n/g, "").replace(/\r/g, "");
        return content;
    } catch (e) {
        // �ǂݍ��ݎ��s���̓G���[���b�Z�[�W��\�����󕶎����Ԃ�
        WScript.Echo("�t�@�C���ǂݍ��݃G���[: " + filePath);
        return "";
    }
}

// �t�@�C�����Ɠ��e��UTF-8�iBOM�Ȃ��j�Ŏw��t�@�C���ɒǋL����֐�
function appendToOutput(outputFile, filename, content) {
    try {
        // ADODB.Stream���g�p����UTF-8�o�͂�ۏ�
        var stream = new ActiveXObject("ADODB.Stream");
        stream.Type = 2; // �e�L�X�g���[�h
        stream.Charset = "utf-8"; // UTF-8�G���R�[�f�B���O
        stream.Open();

        // �����t�@�C���̓��e��ǂݍ��ށi���񏑂����ݎ��̓X�L�b�v�j
        var existingContent = "";
        if (fso.FileExists(outputFile)) {
            var readStream = new ActiveXObject("ADODB.Stream");
            readStream.Type = 2;
            readStream.Charset = "utf-8";
            readStream.Open();
            readStream.LoadFromFile(outputFile);
            existingContent = readStream.ReadText();
            readStream.Close();
            // �������e����BOM���폜
            existingContent = existingContent.replace(/^\uFEFF/, "");
        }

        // �V�������e�������i�������e + �V�����s�j
        var newContent = existingContent;
        if (newContent !== "" && !newContent.match(/\n$/)) {
            newContent += "\n"; // �������e�̖����ɉ��s���Ȃ��ꍇ�ǉ�
        }
        newContent += filename + " " + content; // �t�@�C�����Ɠ��e��ǉ�

        // BOM���폜
        newContent = newContent.replace(/^\uFEFF/, "");

        // �t�@�C���ɏ������݁iUTF-8�ŏ㏑���j
        stream.WriteText(newContent); // �������e�ƐV�������e����������
        stream.SaveToFile(outputFile, 2); // �t�@�C���ɕۑ��i�㏑�����[�h�j
        stream.Close(); // �X�g���[�������
    } catch (e) {
        // �������݃G���[���Ƀ��b�Z�[�W��\��
        WScript.Echo("�o�̓t�@�C���ւ̏������݃G���[: " + outputFile);
    }
}

// ���C������
try {
    // �R�}���h���C���������擾
    var args = WScript.Arguments;
    if (args.length < 1) {
        // �o�̓t�@�C�������w�肳��Ă��Ȃ��ꍇ�A�G���[��\�����ďI��
        WScript.Echo("�G���[: �o�̓t�@�C�����i��F00_index.txt�j���w�肵�Ă��������B");
        WScript.Quit(1);
    }
    if (args.length < 2) {
        // ���̓t�@�C�����w�肳��Ă��Ȃ��ꍇ�A�G���[��\�����ďI��
        WScript.Echo("�G���[: ���Ȃ��Ƃ�1�̓��̓t�@�C�����w�肵�Ă��������B");
        WScript.Quit(1);
    }

    // �o�̓t�@�C���������������擾
    var outputFilename = args(0);
    // �����ȃt�@�C�����i��A���ꕶ���A�\�񖼁j���`�F�b�N
    if (outputFilename === "" || outputFilename.match(/[\\\/:*?"<>|]/) || 
        outputFilename.match(/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i)) {
        WScript.Echo("�G���[: �����ȏo�̓t�@�C�����ł�: " + outputFilename);
        WScript.Quit(1);
    }

    // �o�̓t�@�C���p�X�𐶐��i�ŏ��̓��̓t�@�C���̐e�t�H���_ + �o�̓t�@�C�����j
    var outputDir = fso.GetParentFolderName(fso.GetAbsolutePathName(args(1)));
    var outputFile = outputDir + "\\" + outputFilename;

    // �e���̓t�@�C���i�������ȍ~�j������
    for (var i = 1; i < args.length; i++) {
        var filePath = args(i);
        if (!fso.FileExists(filePath)) {
            // �t�@�C�������݂��Ȃ��ꍇ�A�x����\�����ăX�L�b�v
            WScript.Echo("�x��: �t�@�C�������݂��܂���: " + filePath);
            continue;
        }

        // �t�@�C���̓��e��ǂݍ���
        var content = readFileContent(filePath);
        if (content === "") {
            // ���e����̏ꍇ�A�X�L�b�v
            WScript.Echo("�x��: �t�@�C���̓��e����ł�: " + filePath);
            continue;
        }

        // ���̓t�@�C�����݂̂��擾
        var shortFilename = fso.GetFileName(filePath);

        // �o�̓t�@�C���ɒǋL
        appendToOutput(outputFile, shortFilename, content);
    }

} catch (e) {
    // �S�̂̃G���[���Ƀ��b�Z�[�W��\��
    WScript.Echo("�G���[: " + e.description);
    WScript.Quit(1);
}
