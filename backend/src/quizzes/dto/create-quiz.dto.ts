import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  registerDecorator,
  ValidateNested,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export enum QuestionType {
  BOOLEAN = 'BOOLEAN',
  INPUT = 'INPUT',
  CHECKBOX = 'CHECKBOX',
}

function BooleanOptionsValidation(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'booleanOptionsValidation',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const obj = args.object as CreateQuestionDto;
          if (obj.type !== QuestionType.BOOLEAN) {
            return true;
          }
          if (!Array.isArray(value)) {
            return false;
          }
          if (value.length !== 2) {
            return false;
          }
          const texts = value.map((opt: CreateOptionDto) => opt.text);
          return texts.includes('True') && texts.includes('False');
        },
        defaultMessage(args: ValidationArguments) {
          return 'BOOLEAN questions must have exactly two options: "True" and "False".';
        },
      },
    });
  };
}

class CreateOptionDto {
  @IsString()
  text: string;

  @IsBoolean()
  isCorrect: boolean;
}

class CreateQuestionDto {
  @IsString()
  title: string;

  @IsEnum(QuestionType)
  type: QuestionType;

  @IsOptional()
  @IsString()
  correctAnswer?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOptionDto)
  @BooleanOptionsValidation({
    message: 'BOOLEAN questions must have options "True" and "False".',
  })
  options?: CreateOptionDto[];
}

export class CreateQuizDto {
  @IsString()
  title: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}
