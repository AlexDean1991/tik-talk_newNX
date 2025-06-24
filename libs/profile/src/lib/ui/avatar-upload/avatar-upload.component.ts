import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DndDirective, ImgUrlPipe, SvgIconComponent } from '@tt/common-ui';
import { ProfileService } from '@tt/data-access';

@Component({
    selector: 'app-avatar-upload',
    imports: [SvgIconComponent, DndDirective, FormsModule, ImgUrlPipe],
    templateUrl: './avatar-upload.component.html',
    styleUrl: './avatar-upload.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvatarUploadComponent {
  private readonly placeholder = '/assets/imgs/avatar-placeholder.png';
  private profileService = inject(ProfileService);

  preview = signal<string>(this.placeholder);
  avatar: File | null = null;

  constructor() {
    effect(() => {
      const profile = this.profileService.me();
      const url = profile?.avatarUrl ?? this.placeholder;
      this.preview.set(url);
    });
  }

  fileBrowserHandler(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    this.processFile(file);
  }

  onFileDroped(file: File) {
    this.processFile(file);
  }

  processFile(file: File | null | undefined) {
    if (!file || !file.type.match('image')) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      this.preview.set(event.target?.result?.toString() ?? '');
    };

    reader.readAsDataURL(file);
    this.avatar = file;
  }
}
