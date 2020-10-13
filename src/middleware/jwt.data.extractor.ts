import { jwtServiceFactory } from "../auth/jwt/jwt.service";
import { createJwtDataExtractor } from "./jwt.data.extractor.factory";

export const extractJwtData = createJwtDataExtractor(jwtServiceFactory);

