import PageTitle from "@/components/PageTitle";
import IntegrationCard from "./_components/integration-card";
import { useQuery } from "@tanstack/react-query";
import { getAllIntegrationQueryFn } from "@/lib/api";
import { Loader } from "@/components/loader";
import { ErrorAlert } from "@/components/ErrorAlert";
import { useLocation, useNavigate } from "react-router-dom";

const Integrations = () => {
  const { data, isFetching, isError, error } = useQuery({
    queryKey: ["integration_list"],
    queryFn: getAllIntegrationQueryFn,
  });

  const integrations = data?.userIntegrations || [];
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract the "success" parameter from the query string
  const searchParams = new URLSearchParams(location.search);
  const success = searchParams.get("success");

  // If the "success" parameter is "true", show a success message or handle the success case
  if (success === "true") {
    // You can show a success message or perform other actions based on successful authentication
    return (
      <div className="flex flex-col !gap-5">
        <PageTitle
          title="Integration Successful"
          subtitle="Your integration with Google was successful!"
        />
        {/* Optionally, redirect to another page or show a success banner */}
        <div className="text-center text-green-500 mt-4">
          <p>Google integration was successful. You're ready to start!</p>
        </div>
      </div>
    );
  }

  // If there's an error or the data is still being fetched, show loading or error UI
  return (
    <div className="flex flex-col !gap-5">
      <PageTitle
        title="Integrations & apps"
        subtitle="Connect all your apps directly from here. You need to connect these apps"
      />

      <ErrorAlert isError={isError} error={error} />

      <div className="relative flex flex-col gap-4">
        <section className="flex flex-col gap-4 text-muted-foreground">
          {isFetching || isError ? (
            <div className="flex items-center justify-center min-h-[30vh]">
              <Loader size="lg" color="black" />
            </div>
          ) : (
            <div className="space-y-4">
              {integrations.map((integration) => (
                <IntegrationCard
                  key={integration.app_type}
                  isDisabled={integration.app_type !== "GOOGLE_MEET_AND_CALENDAR"}
                  appType={integration.app_type}
                  title={integration.title}
                  isConnected={integration.isConnected}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Integrations;
