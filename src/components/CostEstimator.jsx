// cost panel on the right side

const CostEstimator = ({ items }) => {
  if (!items || items.length === 0) return null

  // add everything up
  const total = items.reduce((sum, item) => sum + item.amount, 0)

  // hardcoded budget for now
  const budget = 2000
  const pct = Math.min(Math.round((total / budget) * 100), 100)

  return (
    <div className="cost-panel">
      <h3>Trip Cost</h3>

      <div className="cost-total">
        ${total.toLocaleString()}
        <span>est.</span>
      </div>

      <div className="cost-items">
        {items.map((item, i) => (
          <div key={i} className={`cost-item ${item.isNew ? 'new' : ''}`}>
            <span className="ci-label">{item.label}</span>
            <span className="ci-value">${item.amount.toLocaleString()}</span>
          </div>
        ))}

        <div className="cost-divider" />

        <div className="cost-row-total">
          <span>Total</span>
          <span>${total.toLocaleString()}</span>
        </div>
      </div>

      {/* budget progress bar */}
      <div className="budget-bar-wrap">
        <div className="budget-bar-labels">
          <span>Budget used</span>
          <span>{pct}% of ${budget.toLocaleString()}</span>
        </div>
        <div className="budget-bar">
          <div className="budget-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  )
}

export default CostEstimator
