import { VandorPayload } from "./vandor.dto";
import { CustomerPayload } from "./Customer.dto";

export type AuthPayLoad = VandorPayload | CustomerPayload // | AdminPayload