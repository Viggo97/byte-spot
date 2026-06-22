import { Component, inject, signal } from '@angular/core';
import { TranslatePipe, UserService } from '@core';
import { form, FormField, FormRoot, maxLength, minLength, pattern, required } from '@angular/forms/signals';
import { toSignal } from '@angular/core/rxjs-interop';
import { FileUploadComponent } from '@byte-spot-lib';
import { LoaderComponent, SvgIconComponent } from '@shared';
import { ApplicationDataService } from '../application-data.service';
import { firstValueFrom } from 'rxjs';
import { SendApplicationDto } from '@app/features/application/apply/send-application-dto.interface';
import { ActivatedRoute, RouterLink } from '@angular/router';

interface ApplyModel {
    firstName: string;
    lastName: string;
    email: string;
    resume: File | null;
}

@Component({
    selector: 'bsa-application-apply',
    imports: [
        TranslatePipe,
        SvgIconComponent,
        FormRoot,
        FormField,
        FileUploadComponent,
        LoaderComponent,
        RouterLink,
    ],
    templateUrl: './apply.component.html',
    styleUrl: './apply.component.scss',
})
export class ApplicationApplyComponent {
    private readonly _activatedRoute = inject(ActivatedRoute);
    private readonly _applicationDataService = inject(ApplicationDataService);
    private readonly _userService = inject(UserService);
    private readonly _userData = toSignal(this._userService.user$);

    private offerId = this._activatedRoute.snapshot.params['id'] as string;

    protected applyModel = signal<ApplyModel>({
        firstName: this._userData()?.firstName || '',
        lastName: this._userData()?.lastName || '',
        email: this._userData()?.email || '',
        resume: null,
    });

    protected applyForm = form(
        this.applyModel,
        (schemaPath) => {
            required(schemaPath.firstName, {message: 'user.firstNameRequired'});
            minLength(schemaPath.firstName, 2, {message: 'user.firstNameMinLength'});
            maxLength(schemaPath.firstName, 32, {message: 'user.firstNameMaxLength'});

            required(schemaPath.lastName, {message: 'user.lastNameRequired'});
            minLength(schemaPath.lastName, 3, {message: 'user.lastNameMinLength'});
            maxLength(schemaPath.lastName, 64, {message: 'user.lastNameMaxLength'});

            required(schemaPath.email, {message: 'user.emailRequired'});
            pattern(schemaPath.email, /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                {message: 'user.emailInvalid'});

            required(schemaPath.resume, {message: 'application.resumeRequired'});
        },
        {
            submission: {
                action: async () => {
                    const resume = this.applyModel().resume;
                    if (!resume) {
                        return;
                    }
                    const applicationDto: SendApplicationDto = {
                        offerId: this.offerId,
                        firstName: this.applyModel().firstName,
                        lastName: this.applyModel().lastName,
                        email: this.applyModel().email,
                        resume: resume,
                    };
                    await firstValueFrom(this._applicationDataService.sendApplication(applicationDto));
                    this.saved.set(true);
                },
            },
        });

    protected saved = signal(false);
}
