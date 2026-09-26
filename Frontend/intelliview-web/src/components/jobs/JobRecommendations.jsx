import { Lightbulb } from "lucide-react";
function JobRecommendations({ recommendations = [] }) {
  if (!recommendations.length) return null;
  return (
    <section className="job-recommendations">
      <div className="section-card-heading">
        <div>
          <p>Recommendations</p>
          <h3>How to improve your fit</h3>
        </div>
        <Lightbulb size={18} />
      </div>
      {recommendations.map((recommendation, index) => (
        <article key={recommendation}>
          <span>0{index + 1}</span>
          <p>{recommendation}</p>
        </article>
      ))}
    </section>
  );
}
export default JobRecommendations;
