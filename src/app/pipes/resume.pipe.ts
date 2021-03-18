import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'resume'
})
export class ResumePipe implements PipeTransform {

  transform(text: string, max?: number): string {
    if ((!max && text.length < 130) || (max && text.length < max))
      return text;
    else {
      return text.substring(0, (max && !isNaN(max)) ? max : 130) + "...";
    }
  }
}
