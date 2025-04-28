// import { plainToInstance } from "class-transformer";
// import { validate } from "class-validator";
// import { Request, Response, NextFunction } from "express";
// import { BadRequestError } from "../errors";

// export function validateParams<T extends object>(Dto: new () => T) {
//   return async (req: Request, _res: Response, next: NextFunction) => {
//     const dtoInstance = plainToInstance(Dto, req.params as object, {
//       enableImplicitConversion: true,
//     });

//     const errors = await validate(dtoInstance, { whitelist: true });
//     if (errors.length) {
//       next(
//         new BadRequestError(
//           errors.flatMap((e) => Object.values(e.constraints ?? {})).join("; ")
//         )
//       );
//       return;
//     }
//     next();
//   };
// }
