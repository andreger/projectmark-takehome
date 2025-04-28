// import { Request, Response, NextFunction } from "express";
// import { ClassConstructor, plainToInstance } from "class-transformer";
// import { validate } from "class-validator";
// import { BadRequestError } from "../errors";

// export function validateBody<T extends object>(dtoClass: ClassConstructor<T>) {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     const dtoInstance = plainToInstance(dtoClass, req.body);
//     const errors = await validate(dtoInstance);

//     if (errors.length > 0) {
//       const errorMessages = errors.flatMap((error) =>
//         Object.values(error.constraints || {})
//       );
//       next(
//         new BadRequestError(
//           "Validation errors found: " + errorMessages.join(", ")
//         )
//       );
//       return;
//     }

//     req.body = dtoInstance;
//     next();
//   };
// }
