import {
  RiFilePdf2Line,
  RiFileExcel2Line,
  RiFileTextLine,
  RiFilePpt2Line,
  RiFileWord2Line,
  RiFileExcelLine,
  RiFilePptLine,
  RiFileWordLine,
} from "react-icons/ri";

export function getFileIcon(path: string): any {
  const fileType = path.split(".").pop() || "";
  const fileTypeToIcon: { [key: string]: any } = {
    pdf: RiFilePdf2Line,
    docx: RiFileWord2Line,
    doc: RiFileWordLine,
    pptx: RiFilePpt2Line,
    ppt: RiFilePptLine,
    txt: RiFileTextLine,
    csv: RiFileTextLine,
    xlsx: RiFileExcel2Line,
    xls: RiFileExcelLine,
  };
  return fileTypeToIcon[fileType] || RiFileTextLine;
}
