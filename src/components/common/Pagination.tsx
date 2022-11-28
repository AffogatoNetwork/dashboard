import React from "react";
import {PaginationType} from "./types";
import {useTranslation} from "react-i18next";

type props = {
    pagination: PaginationType;
    onPageSelected: (pageNumber: number) => void;
};

export const CustomPagination = ({pagination, onPageSelected}: props) => {
    const {t} = useTranslation();
    console.log(pagination);
    console.log(onPageSelected)
    const pag = Array.from(Array(pagination.pages).keys());
    console.log(pag);
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
                    className={`${pagination.current === 1 && "btn-active"} btn btn-circle `}
                >{1}</button>
                {pagination.current >= 3 && pagination.current < midPages[0] && (
                    <button className="btn btn-disabled border border-black">...</button>
                )}
                {pagination.current > 1 && pagination.current < midPages[0] && (
                    <button
                        onClick={() => onPageSelected(pagination.current)}
                        className={`${pagination.current === activePag && "btn-active"} btn btn-outline`}
                    >{activePag}</button>
                )}
                <button className="btn btn-disabled border border-black">...</button>

                {midPages.map((item) => (
                    <button
                        key={item}
                        onClick={() => onPageSelected(item)}
                        className={`${pagination.current === item && "btn-active"} btn btn-outline`}
                    >
                        {item}
                    </button>
                ))}
                <button className="btn btn-disabled border border-black">...</button>

                {pagination.current < pagination.pages &&
                    pagination.current > midPages[4] && (
                        <button
                            className={`${pagination.current === pagination.pages && "btn-active"} btn btn-outline`}
                        >{activePag}</button>
                    )}
                {pagination.current < pagination.pages - 1 &&
                    pagination.current > midPages[4] &&
                    <button className="btn btn-disabled border border-black">...</button>
                }
                <button
                    onClick={() => onPageSelected(pagination.pages)}
                    className={`${pagination.current === pagination.pages && "btn-active"} btn btn-outline`}
                >
                    {pagination.pages}
                </button>
            </div>
        );
    };

    return (
        <div className="btn-group">
            {pagination.pages >= 10 && (
                <button
                    onClick={() => onPageSelected(1)}
                    disabled={pagination.previous === 0}
                    className="btn btn-outline"
                >«
                </button>
            )}
            {pagination.pages > 1 && (
                <button
                    onClick={() => onPageSelected(pagination.previous)}
                    disabled={pagination.previous === 0}
                    className="btn btn-outline"
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
                        className={`${pagination.current === item && "btn-active"} custom-pagination  btn btn-outline`}
                    >
                        {item}
                    </button>
                ))
            )}

            {pagination.pages > 1 && (


                <button
                onClick={() => onPageSelected(pagination.next)}
                disabled={pagination.current === pagination.pages}
                className="btn btn-outline"
            >
                <>{t("next")}</>
            </button>
            )}


            {pagination.pages >= 10 && (
                <button
                    onClick={() => onPageSelected(pagination.pages)}
                    disabled={pagination.next === 0}
                    className="btn btn-outline"
                >»
                </button>
            )}
        </div>
    );
};
