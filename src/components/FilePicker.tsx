import upload_logo from "../assets/upload.svg";
import trash_logo from "../assets/trash.svg";
import { FileToDisplay } from "../hooks/useUploadSelection";

type FilePickerProps = {
  files: Array<FileToDisplay>;
  hasFiles: boolean;
  onFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onDeleteFiles: () => void;
  onRemoveFile: (key: string) => Promise<void>;
  emptyTitle: string;
  emptyHint: string;
  inputId: string;
};

const FilePicker = ({
  files,
  hasFiles,
  onFileInputChange,
  onDeleteFiles,
  onRemoveFile,
  emptyTitle,
  emptyHint,
  inputId,
}: FilePickerProps) => {
  return (
    <div className="rounded-2xl border border-[#e5e7eb] bg-[#fbfcfd] p-3 sm:p-4">
      {hasFiles && (
        <div className="relative flex h-32 items-center gap-3 overflow-x-auto pr-12">
          {files.map((file) => (
            <div key={file.key} className="relative h-24 w-24 shrink-0">
              <img
                src={file.url}
                alt={file.name}
                className="h-24 w-24 rounded-lg border border-[#dde3eb] bg-white object-contain p-2"
              />
              <button
                type="button"
                onClick={() => onRemoveFile(file.key)}
                className="absolute -right-1.5 -top-1.5 h-5 w-5 rounded-full border border-[#d8dee8] bg-white text-xs leading-none text-[#5a6576] transition hover:border-red-500 hover:text-red-600"
              >
                ×
              </button>
            </div>
          ))}
          <label
            htmlFor={inputId}
            className="shrink-0 cursor-pointer rounded-lg border border-dashed border-[#cfd7e3] bg-white px-3 py-2 text-xs font-semibold text-[#1f2937] transition hover:border-[#9ca7b8]"
          >
            Add more files
          </label>
          <button
            type="button"
            onClick={onDeleteFiles}
            className="absolute right-1 top-1 h-8 w-8 rounded-full border border-[#d8dee8] bg-white p-1 transition hover:scale-105 hover:border-red-500"
          >
            <img src={trash_logo} alt="delete files" className="h-full w-full" />
          </button>
        </div>
      )}

      {!hasFiles && (
        <label
          htmlFor={inputId}
          className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#cfd7e3] bg-white text-center transition hover:border-[#9ca7b8] hover:bg-[#fafbff]"
        >
          <img src={upload_logo} alt="upload" className="mb-2 h-7 w-7" />
          <div className="text-sm font-medium text-[#1f2937]">{emptyTitle}</div>
          <span className="mt-1 text-xs text-[#748094]">{emptyHint}</span>
          <span className="mt-3 rounded-lg border border-[#1f2937] px-4 py-1.5 text-xs font-semibold text-[#1f2937]">
            Browse Files
          </span>
        </label>
      )}

      <input
        onChange={onFileInputChange}
        type="file"
        accept="image/*"
        multiple
        hidden
        id={inputId}
      />
    </div>
  );
};

export default FilePicker;
