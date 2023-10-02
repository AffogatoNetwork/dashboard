import React from 'react'

const Farmers = ({ farmers }: { farmers: any[] }) => {
    return (
        <div>
            {farmers.map((farmer: any, index: any) => (
                <div key={index}>
                    <p>
                        <a className="hover:underline underline-offset-1 decoration-sky-500" href={'/farmer' + '/' + farmer?.address}>
                            {farmer?.fullname}
                        </a>
                    </p>
                </div>
            ))
            }
        </div >
    )
}

export default Farmers