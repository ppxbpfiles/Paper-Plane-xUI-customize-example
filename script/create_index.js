/*
 * ���̓t�@�C���i��: sample.jpg�j�ƑΉ�����e�L�X�g�t�@�C���isample.jpg.txt �܂��� sample.txt�j�̓��e��ǂݍ��݁A
 * ���s���폜���ăC���f�b�N�X�t�@�C���ɒǋL���܂��B
 * ���s���@:
 *   cscript //Nologo create_index.js <�t���O> <�o�̓t�@�C��> <���̓t�@�C��1> [<���̓t�@�C��2> ...]
 * ��:
 *   cscript //Nologo create_index.js output_both 00_index.txt C:\test\file1.jpg
 *   - �o�͗�: "file1.jpg HelloWorld" �܂��� "file1.jpg [NoTextFile]" �܂��� "file1.jpg [NoTextContent]"
 *   cscript //Nologo create_index.js skip_empty 00_index.txt C:\test\file1.jpg
 *   - �e�L�X�g�t�@�C�����Ȃ�/��̏ꍇ�A�o�͂��Ȃ�
 * ����:
 *   - �������i�t���O�j: �e�L�X�g�t�@�C�������݂��Ȃ�/��̏ꍇ�̓�����w��B
 *     - "output_both": 1��ځi���̓t�@�C�����j��2��ځi[NoTextFile] �܂��� [NoTextContent]�j�̗������o�́B
 *     - "skip_empty": �e�L�X�g�t�@�C�������݂��Ȃ�/��̏ꍇ�A�o�͂��X�L�b�v�B
 *   - �������i�o�̓t�@�C���j: ���ʂ�ۑ�����t�@�C�����B�t�@�C�����́u00_index�v�Ŏn�܂�A�g���q�́u.txt�v�łȂ���΂Ȃ�Ȃ��i��F00_index.txt, 00_index_something.txt�j�B
 *   - ��O�����ȍ~�i���̓t�@�C���j: ��������t�@�C���i��Fsample.jpg�j�B
 * �o��:
 *   - �ŏ��̓��̓t�@�C���̐e�t�H���_��<�o�̓t�@�C��>���쐬�iUTF-8�ABOM�Ȃ��j�B
 *   - �`��: ���̓t�@�C�����ƑΉ�����e�L�X�g�t�@�C���̓��e�i���s�Ȃ��j���󔒋�؂��1�s�A�e�G���g���͉��s�ŋ�؂�B
 *   - �t���O�� "output_both" �̏ꍇ:
 *     - �e�L�X�g�t�@�C�����Ȃ��ꍇ�A�x����\������ "[NoTextFile]" ���o�́B
 *     - �e�L�X�g�t�@�C���̓��e����̏ꍇ�A�x����\������ "[NoTextContent]" ���o�́B
 *   - �t���O�� "skip_empty" �̏ꍇ:
 *     - �e�L�X�g�t�@�C�����Ȃ�/��̏ꍇ�A�x����\�������o�͂��X�L�b�v�B
 * �G���[:
 *   - �������s���A�t���O�������A�o�̓t�@�C�������u00_index�v�Ŏn�܂炸�܂��͊g���q��.txt�łȂ��A�܂��͖����ȃt�@�C�����̏ꍇ�ɃG���[���b�Z�[�W��\�����A�X�N���v�g���I���B
 * ����:
 *   - �X�y�[�X���܂ރt�@�C���p�X�͈��p���ň͂�ł��������i��F"C:\test\file name.jpg"�j�B
 *   - �e�L�X�g�t�@�C����UTF-8�G���R�[�f�B���O�𐄏��B
 *   - �t���O�� "output_both" �̏ꍇ�A�e�L�X�g�t�@�C�����Ȃ�/��̃t�@�C����grep�ňꗗ�\:
 *     - ��: `grep "\[NoTextFile\]" 00_index.txt`�i�e�L�X�g�t�@�C�����Ȃ��ꍇ�j
 *     - ��: `grep "\[NoTextContent\]" 00_index.txt`�i�e�L�X�g�t�@�C������̏ꍇ�j
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
        content = content.replace(/\r\n/g, "").replace(/\n/g, "").replace(/\r/g, "");
        return content;
    } catch (e) {
        WScript.Echo("�t�@�C���ǂݍ��݃G���[: " + filePath);
        return "";
    }
}

// �t�@�C�����Ɠ��e��UTF-8�iBOM�Ȃ��j�Ŏw��t�@�C���ɒǋL����֐�
function appendToOutput(outputFile, filename, content) {
    try {
        var stream = new ActiveXObject("ADODB.Stream");
        stream.Type = 2;
        stream.Charset = "utf-8";
        stream.Open();

        // �����t�@�C���̓��e��ǂݍ���
        var existingContent = "";
        if (fso.FileExists(outputFile)) {
            var readStream = new ActiveXObject("ADODB.Stream");
            readStream.Type = 2;
            readStream.Charset = "utf-8";
            readStream.Open();
            readStream.LoadFromFile(outputFile);
            existingContent = readStream.ReadText();
            readStream.Close();
            existingContent = existingContent.replace(/^\uFEFF/, ""); // BOM�폜
        }

        // �V�������e������
        var newContent = existingContent;
        if (newContent !== "" && !newContent.match(/\n$/)) {
            newContent += "\n";
        }
        newContent += filename + " " + content;

        // BOM���폜
        newContent = newContent.replace(/^\uFEFF/, "");

        // �t�@�C���ɏ�������
        stream.WriteText(newContent);
        stream.SaveToFile(outputFile, 2); // �㏑�����[�h
        stream.Close();
    } catch (e) {
        WScript.Echo("�o�̓t�@�C���ւ̏������݃G���[: " + outputFile);
    }
}

// ���C������
try {
    var args = WScript.Arguments;
    if (args.length < 1) {
        WScript.Echo("�G���[: �t���O�ioutput_both �܂��� skip_empty�j���w�肵�Ă��������B");
        WScript.Quit(1);
    }
    if (args.length < 2) {
        WScript.Echo("�G���[: �o�̓t�@�C�����i��F00_index.txt�j���w�肵�Ă��������B");
        WScript.Quit(1);
    }
    if (args.length < 3) {
        WScript.Echo("�G���[: ���Ȃ��Ƃ�1�̓��̓t�@�C�����w�肵�Ă��������B");
        WScript.Quit(1);
    }

    var flag = args(0);
    // �t���O���L�����`�F�b�N
    if (flag !== "output_both" && flag !== "skip_empty") {
        WScript.Echo("�G���[: �t���O�́uoutput_both�v�܂��́uskip_empty�v�łȂ���΂Ȃ�܂���: " + flag);
        WScript.Quit(1);
    }

    var outputFilename = args(1);
    // �o�̓t�@�C�������u00_index�v�Ŏn�܂�A�g���q��.txt���`�F�b�N
    if (!outputFilename.match(/^00_index.*\.txt$/i)) {
        WScript.Echo("�G���[: �o�̓t�@�C�����́u00_index�v�Ŏn�܂�A\n�g���q���u.txt�v�łȂ���΂Ȃ�܂���i��: 00_index_something.txt�j: " + outputFilename);
        WScript.Quit(1);
    }
    if (outputFilename === "" || outputFilename.match(/[\\\/:*?"<>|]/) || 
        outputFilename.match(/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i)) {
        WScript.Echo("�G���[: �����ȏo�̓t�@�C�����ł�: " + outputFilename);
        WScript.Quit(1);
    }

    var outputDir = fso.GetParentFolderName(fso.GetAbsolutePathName(args(2)));
    var outputFile = outputDir + "\\" + outputFilename;

    // �e���̓t�@�C���i��O�����ȍ~�j������
    for (var i = 2; i < args.length; i++) {
        var filePath = args(i);
        if (!fso.FileExists(filePath)) {
            WScript.Echo("�x��: �t�@�C�������݂��܂���: " + filePath);
            continue;
        }

        // ���̓t�@�C�����i��: sample.jpg�j
        var shortFilename = fso.GetFileName(filePath);

        // �Ή�����e�L�X�g�t�@�C����������
        var txtPath1 = filePath + ".txt"; // sample.jpg.txt
        var txtPath2 = fso.GetParentFolderName(filePath) + "\\" +
                       fso.GetBaseName(filePath) + ".txt"; // sample.txt

        var content = "";
        var hasTextFile = false;
        if (fso.FileExists(txtPath1)) {
            content = readFileContent(txtPath1);
            hasTextFile = true;
            if (content === "") {
                content = "[NoTextContent]"; // �e�L�X�g�t�@�C���̓��e����̏ꍇ
            }
        } else if (fso.FileExists(txtPath2)) {
            content = readFileContent(txtPath2);
            hasTextFile = true;
            if (content === "") {
                content = "[NoTextContent]"; // �e�L�X�g�t�@�C���̓��e����̏ꍇ
            }
        } else {
            content = "[NoTextFile]"; // �e�L�X�g�t�@�C�����Ȃ��ꍇ
        }

        // �t���O�Ɋ�Â��ďo�͂��邩�ǂ���������
        if (flag === "skip_empty" && (content === "[NoTextFile]" || content === "[NoTextContent]")) {
            continue; // �e�L�X�g�t�@�C�����Ȃ�/��̏ꍇ�A�X�L�b�v
        }

        // �o�̓t�@�C���ɒǋL�i1���: ���̓t�@�C����, 2���: �e�L�X�g���e�܂���[NoTextFile]/[NoTextContent]�j
        appendToOutput(outputFile, shortFilename, content);
    }

} catch (e) {
    WScript.Echo("�G���[: " + e.description);
    WScript.Quit(1);
}