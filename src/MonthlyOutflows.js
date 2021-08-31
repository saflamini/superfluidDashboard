function MonthlyOutflows(props) {
    return (
        <div>
            <h2><strong>Total Monthly Outflows</strong></h2>
            <h3>{`$${props.outflows.toFixed(2)}`}</h3>
          
            <h5><strong>Your Balance Will Hit Zero On:</strong></h5>
            <h6>{props.endDate}</h6>
          
            </div>
        )
    }

export default MonthlyOutflows;