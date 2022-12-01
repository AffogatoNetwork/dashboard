import React from "react";
import {PaginationType} from "./types";
import {useTranslation} from "react-i18next";

type props = {
    pagination: PaginationType;
    onPageSelected: (pageNumber: number) => void;
    className: string;
};

export const CustomPagination = ({pagination, onPageSelected, className}: props) => {
    const {t} = useTranslation();
    const pag = Array.from(Array(pagination.pages).keys());
    const activePag = pagination.current;

    const VaultPages = () => {
        const midPages = Array.from(Array(5).keys());
        const midPage = Math.floor(pagination.pages / 2);
        midPages[0] = midPage - 2;
        midPages[1] = midPage - 1;
        midPages[2] = midPage;
        midPages[3] = midPage + 1;
        midPages[4] = midPage + 2;

        return (
            <div className="btn-group">
                <button
                    onClick={() => onPageSelected(1)}
                    className={`${pagination.current === 1 && "btn-active"} btn btn-outline btn-xs sm:btn-sm md:btn-md lg:btn-md`}
                >{1}</button>
                {pagination.current >= 3 && pagination.current < midPages[0] && (
                    <button className="btn btn-disabled border border-black btn-xs sm:btn-sm md:btn-md lg:btn-md">...</button>
                )}
                {pagination.current > 1 && pagination.current < midPages[0] && (
                    <button
                        onClick={() => onPageSelected(pagination.current)}
                        className={`${pagination.current === activePag && "btn-active"} btn btn-outline btn-xs sm:btn-sm md:btn-md lg:btn-md`}
                    >{activePag}</button>
                )}
                <button className="btn btn-disabled border border-black btn-xs sm:btn-sm md:btn-md lg:btn-md">...</button>

                {midPages.map((item) => (
                    <button
                        key={item}
                        onClick={() => onPageSelected(item)}
                        className={`${pagination.current === item && "btn-active"} btn btn-outline btn-xs sm:btn-sm md:btn-md lg:btn-md`}
                    >
                        {item}
                    </button>
                ))}
                <button className="btn btn-disabled border border-black btn-xs sm:btn-sm md:btn-md lg:btn-md">...</button>

                {pagination.current < pagination.pages &&
                    pagination.current > midPages[4] && (
                        <button
                            className={`${pagination.current === pagination.pages && "btn-active"} btn btn-outline btn-xs sm:btn-sm md:btn-md lg:btn-md`}
                        >{activePag}</button>
                    )}
                {pagination.current < pagination.pages - 1 &&
                    pagination.current > midPages[4] &&
                    <button className="btn btn-disabled border border-black btn-xs sm:btn-sm md:btn-md lg:btn-md">...</button>
                }
                <button
                    onClick={() => onPageSelected(pagination.pages)}
                    className={`${pagination.current === pagination.pages && "btn-active"} btn btn-outline btn-xs sm:btn-sm md:btn-md lg:btn-md`}
                >
                    {pagination.pages}
                </button>
            </div>
        );
    };

    return (
        <div

            // @ts-ignore

        className={`btn-group ${className} lg:btn-group-horizontal w-fit overflow-hidden pt-4`}>
            {pagination.pages >= 10 && (
                <button
                    onClick={() => onPageSelected(1)}
                    disabled={pagination.previous === 0}

                    className="btn btn-outline btn-xs sm:btn-sm md:btn-md lg:btn-md">
                    «
                </button>
            )}
            {pagination.pages > 1 && (
                <button
                    onClick={() => onPageSelected(pagination.previous)}
                    disabled={pagination.previous === 0}
                    className="btn btn-outline btn-xs sm:btn-sm md:btn-md lg:btn-md"
                ><>{t("previous")}</>
                </button>
            )}


            {pagination.pages >= 10 ? (
                <VaultPages/>
            ) : (
                pag.map((item) => (
                    <button
                        id={"button" + `${item}`}
                        key={item}
                        onClick={() => onPageSelected(item)}
                        className={`${pagination.current === item && "btn-active"} custom-pagination  btn btn-outline btn-xs sm:btn-sm md:btn-md lg:btn-md`}
                    >
                        {item}
                    </button>
                ))
            )}

            {pagination.pages > 1 && (


                <button
                onClick={() => onPageSelected(pagination.next)}
                disabled={pagination.current === pagination.pages}
                className="btn btn-outline btn-xs sm:btn-sm md:btn-md lg:btn-md"
            >
                <>{t("next")}</>
            </button>
            )}


            {pagination.pages >= 10 && (
                <button
                    onClick={() => onPageSelected(pagination.pages)}
                    disabled={pagination.next === 0}
                    className="btn btn-outline btn-xs sm:btn-sm md:btn-md lg:btn-md"
                >»
                </button>
            )}
        </div>
    );
};
