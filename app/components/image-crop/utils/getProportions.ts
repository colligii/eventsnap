import { Proportions, SizeConfig } from "../types";

export const getProportion = (proportions: Proportions, sizeConfig: SizeConfig) => {
    const rightProportion = Object.entries(proportions).find(([key, value]: [string, (size: number) => boolean]) => {
        return value(document.body.clientWidth)
    })

    if (!rightProportion)
        throw Error('Not proportion find for this screen');

    return sizeConfig[rightProportion[0]]
}