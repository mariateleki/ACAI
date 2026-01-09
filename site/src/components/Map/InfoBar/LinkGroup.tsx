import { Link, Typography } from "@mui/material";

type LinkGroupProps = {
    title: string;
    links: string[];
};

const LinkGroup = ({ title, links }: LinkGroupProps) => {
    if (!links || links.length === 0) return null;
    return (
        <div style={{ marginTop: 10 }}>
            <Typography fontWeight={500}>{title}:</Typography>
            {links.map((link, i) => (
                <div key={i} style={{ height: 20 }}>
                    <Link
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        underline="hover"
                        sx={{ mr: 1 }}
                    >
                        Website {i + 1}
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default LinkGroup;
