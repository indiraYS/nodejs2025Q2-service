import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, BadGatewayException, BadRequestException } from '@nestjs/common';
import { of, Observable, throwError } from 'rxjs';
import { audit, catchError, map } from 'rxjs/operators';
import { HttpResponse } from 'src/types/Api';
import { ZodError } from 'zod/v4';

@Injectable()
export class GenericInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');

    const now = Date.now();

    // get the request and log it to the console
    const ctx = context.switchToHttp();
    // const request = ctx.getRequest();
    const response = ctx.getResponse();

    return next
      .handle()
      .pipe(
        catchError((err: Error) => {
            if (err instanceof ZodError) {
                const errors = err.issues.map(issue => (
      issue.message + ', path: ' + issue.path.map((p) => p.toLocaleString()).reduce((prev, cur) => prev + cur)
    ));
    return of({data: null, error: new BadRequestException(errors)});

                // return throwError(() => new BadRequestException(errors));
            }
            console.log('error handled:',err)
            if ('error' in err) {
                return of({data: null, error: err.error});
            } else {
                return of({data: null, error: new BadGatewayException(err.message)});
            }
        }),
        map((output: HttpResponse<any, HttpException>) => {
            if (output.error != null) {
                response.status(output.error.getStatus())
                return output.error.getResponse()
            } else {
                return output.data
            }
        })
     );
  }
}