import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function Docs() {
  return (
    <div>
      <h2>API Doc</h2>
      <SwaggerUI url="/swagger/swagger.json" />
    </div>
  );
}
