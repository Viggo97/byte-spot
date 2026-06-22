import { ChangeDetectionStrategy, Component, computed, input, model, output, signal, ViewEncapsulation } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

interface FileUploadError {
    code: 'INVALID_TYPE' | 'INVALID_SIZE';
    message: string;
}

@Component({
    selector: 'bsl-file-upload',
    imports: [],
    templateUrl: './file-upload.component.html',
    styleUrl: './file-upload.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class FileUploadComponent implements FormValueControl<File | null> {
    id = input.required<string>();
    maxFileSizeBytes = input(5 * 1024 * 1024);
    acceptedMimeType = input('application/pdf');
    ariaLabelSelect = input('Select file');
    ariaLabelChange = input('Change file');
    dropzoneHint = input('Drop file here or click to select');
    maxSizeLabel = input('Max size');
    maxSizeValueLabel = input('5 MB');
    removeButtonLabel = input('Remove file');
    invalidTypeMessage = input('This type is not allowed.');
    invalidSizeMessage = input('Max size of file is:');

    fileSelected = output<File>();
    fileError = output<FileUploadError>();
    fileCleared = output();
    touch = output();

    value = model<File | null>(null);
    touched = model(false);

    readonly isDragging = signal(false);
    readonly selectedFile = signal<File | null>(null);
    readonly errorMessage = signal<string | null>(null);

    protected onDragOver(event: DragEvent): void {
        event.preventDefault();
        this.isDragging.set(true);
    }

    protected onDragLeave(event: DragEvent): void {
        event.preventDefault();
        this.isDragging.set(false);
    }

    protected onDrop(event: DragEvent): void {
        event.preventDefault();
        this.isDragging.set(false);
        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
            this.validateFile(files[0]);
        }
        this.setTouchState();
    }

    protected onFileInputChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (file) {
            this.validateFile(file);
        }
        input.value = '';
    }

    protected clearFile(event: Event): void {
        event.stopPropagation();
        this.selectedFile.set(null);
        this.errorMessage.set(null);
        this.value.set(null);
        this.fileCleared.emit();
    }

    private validateFile(file: File): void {
        const hasValidType = file.type === this.acceptedMimeType();

        if (!hasValidType) {
            this.rejectFile({
                code: 'INVALID_TYPE',
                message: this.invalidTypeMessage(),
            });
            return;
        }

        if (file.size > this.maxFileSizeBytes()) {
            this.rejectFile({
                code: 'INVALID_SIZE',
                message: `${this.invalidSizeMessage} ${this.maxSizeLabel}.`,
            });
            return;
        }

        this.errorMessage.set(null);
        this.selectedFile.set(file);
        this.value.set(file);
        this.fileSelected.emit(file);
    }

    private rejectFile(error: FileUploadError): void {
        this.selectedFile.set(null);
        this.errorMessage.set(error.message);
        this.fileError.emit(error);
    }

    protected fileSize = computed(() => {
        const bytes = this.selectedFile()?.size;
        if (!bytes) {
            return '0 B';
        }
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    });

    protected setTouchState(): void {
        this.touched.set(true);
        this.touch.emit();
    }
}
