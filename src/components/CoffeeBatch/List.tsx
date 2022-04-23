import React, { useState } from "react";
import Card from "react-bootstrap/esm/Card";
import "../../styles/batchlist.scss";
import { CustomPagination } from "../common/Pagination";

const pagDefault = {
  previous: 0,
  current: 0,
  next: 1,
  pages: 5,
  itemsPerPage: 10,
  itemsCount: 30,
  lastId: "0"
}

export const List = () => {
  const [pagination, setPagination] = useState(pagDefault);

  const onPageSelected = (pageNumber: number) => {
    const nextPage = pageNumber === pagination.pages ? 0 : pageNumber + 1;
    const newPagination = {
      ...pagination,
      previous: pageNumber === 1 ? 0 : pageNumber - 1,
      current: pageNumber,
      next: nextPage,
    };
    setPagination(newPagination);
  };

  return (
    <div className="batch-list">
      <Card className="create-card">
        <Card.Header>
          <h2>Lotes de café</h2>
        </Card.Header>
        <Card.Body>
          
        </Card.Body>
        <Card.Footer>
          <CustomPagination pagination={pagination} onPageSelected={onPageSelected} />
        </Card.Footer>
      </Card>  
    </div>    
  );
};
